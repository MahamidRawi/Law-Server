const { issueSubpoenaPrompt, fileMotionPrompt, SubpoenaMessagePrompt, endDepositionPrompt, endDepositionTscrpt, endSettlement, conclusion } = require('../../../helper/openai.api.helper');
const { subpoenaSchema } = require('../../../schemas/joi.schema');
const mongoose = require('mongoose');
require('../../../DB/models/cases.model');
require('../../../DB/models/wallet.model');
const wallet = mongoose.model('walletModel');
const cases = mongoose.model('casesModel');
const { compareBalanceToRequiredAmount, addAdminFee } = require('../wallet.actions');
const { OpenAI } = require('openai');
const { config } = require('../../../config');
const { calculatedPrices, lMPrices } = require('../../../vars/vars');
require('../../../DB/models/depositions.model');
require('../../../DB/models/hearing.model');
require('../../../DB/models/user.model');
const users = mongoose.model('userModel');

const Deposition = mongoose.model('Chat');
const { uuid } = require('uuidv4');


const openai = new OpenAI({ apiKey: config.APIPASS });

const issueSubpoena = async (uid, caseInfo, subpoenaInfo) => {
    try {
        await subpoenaSchema.validateAsync(subpoenaInfo);

        const validSubpoenaType = calculatedPrices.find(subtype => subtype.name === subpoenaInfo.type);
        if (!validSubpoenaType) throw new Error('Invalid Subpoena Type');

        const sufficientBalance = await compareBalanceToRequiredAmount(uid, validSubpoenaType.price);
        if (sufficientBalance) throw new Error('Insufficient Balance');

        const caseFound = await cases.findOne({ _id: caseInfo._id });
        if (!caseFound) throw new Error('Case Not Found');

        const makeRequestAndParseResponse = async (attempt = 0) => {
            const maxRetries = 3;
            try {
                const response = await openai.chat.completions.create({
                    messages: [{ role: "system", content: issueSubpoenaPrompt(caseInfo, validSubpoenaType, subpoenaInfo.justification, subpoenaInfo.entity) }],
                    model: "gpt-3.5-turbo-1106",
                    response_format: {type: 'json_object'}
                });

                const parsedRes = JSON.parse(response.choices[0].message.content);
                console.log('Here is parsed Res : ', parsedRes);
                return parsedRes;
            } catch (error) {
                if (error instanceof SyntaxError && attempt < maxRetries) {
                    
                    return makeRequestAndParseResponse(attempt + 1);
                } else {
                    
                    throw 'An Error has Occured. Please Try Again.';
                }
            }
        };

        const parsedRes = await makeRequestAndParseResponse();

        if (parsedRes.granted === false) return { success: false, message: parsedRes.rationale, stc: 400 };
        await addAdminFee(validSubpoenaType.price, `${validSubpoenaType.name} Fee`, uid, Date.now());
        if (validSubpoenaType.participant && parsedRes.participant.inList) {
            await cases.updateOne({ _id: caseInfo._id, participants: { $elemMatch: { name: parsedRes.participant.details.exactName, role: parsedRes.participant.details.role } }}, { $set: { "participants.$.subpoena": true } });
            return { success: true, message: parsedRes.rationale, stc: 200 };
        } else {
            let newdtls; 

            if (validSubpoenaType.participant) {
                let dtls = parsedRes.participant.details;
                dtls.subpoena = true;
                dtls.ctc = false;
                newdtls = dtls;
            }

            await cases.updateOne({ _id: caseFound._id }, { $push: validSubpoenaType.participant ? { participants: newdtls } : {discoveries:  { $each: [parsedRes.document, parsedRes.ai_move.document] }} });
            return { success: true, message: parsedRes.rationale, stc: 200 };
        }
    } catch (err) {
        return { success: false, message: err.message || 'An error occurred', stc: 500 };
    }
};

const newErr = (message, stc) => {
    const error = new Error(message);
    error.stc = stc
    return error
}

const getRepresentativeLawyer = async (caseId, uid) => {
  if (!caseId) throw newErr('No Case ID Provided', 404); 
  try {
    const caseFound = await cases.findOne({_id: caseId});
    console.log(caseFound)
    if (!caseFound || !caseFound.owners.includes(uid)) throw newErr('Case Not Found Or Doesn\'t Belong to You', 404);
        
    const representativeLawyer = caseFound.participants.find(user => user.atr == true);
    return {representativeLawyer, stc: 200}
  } catch (err) {
        return {message: err.message, stc: err.stc}
  }
}

const fileMotion = async (uid, caseInfo, motionInfo) => {
    try {
        await subpoenaSchema.validateAsync(motionInfo);

        const validMotion = lMPrices.find(motion => motion.name === motionInfo.type);
        if (!validMotion) throw new Error('Invalid Motion Type');

        const sufficientBalance = await compareBalanceToRequiredAmount(uid, validMotion.price);
        if (sufficientBalance) throw new Error('Insufficient Balance');

        const caseFound = await cases.findOne({ _id: caseInfo._id });
        if (!caseFound) throw new Error('Case Not Found');

        const makeRequestAndParseResponse = async (attempt = 0) => {
            const maxRetries = 3;
            try {
                const response = await openai.chat.completions.create({
                    messages: [{ role: "system", content: fileMotionPrompt(caseInfo, validMotion.name, motionInfo.justification, motionInfo.entity) }],
                    model: "gpt-3.5-turbo-1106",
                });
                const parsedRes = JSON.parse(response.choices[0].message.content);
                return parsedRes;
            } catch (error) {
                if (error instanceof SyntaxError && attempt < maxRetries) {
                    return makeRequestAndParseResponse(attempt + 1);
                } else {
                    throw 'An Error has Occured. Please Try Again.';
                }
            }
        };

        const parsedRes = await makeRequestAndParseResponse();

        await addAdminFee(validMotion.price, `${validMotion.name} Fee`, uid, Date.now());
        await cases.updateOne({ _id: caseFound._id }, { $push: {discoveries: parsedRes.document} });
        return { success: true, message: parsedRes.rationale, granted: parsedRes.granted, stc: 200 };
    } catch (err) {
        return { success: false, message: err.message || 'An error occurred', stc: 500 };
    }
}
const startDeposition = async (caseId, subpoenee) => {
    try {
      const caseFound = await cases.findOne({ _id: caseId });
      if (!caseFound) throw new Error('Case Not Found');
      const subpoeneeFound = caseFound.participants.find(part => part.name == subpoenee.name && part.role == subpoenee.role);
      if (!subpoeneeFound) throw new Error('Participant Not Found');

      let deposition = await Deposition.findOneAndUpdate(
        {
          caseId: caseId,
          'subpoenee.name': subpoenee.name,
          'subpoenee.role': subpoenee.role,
          privileged: subpoeneeFound.ctc
        },
        {
          $setOnInsert: { messageHistory: [], attourney: subpoeneeFound?.atr }
        },
        {
          new: true,
          upsert: true // Create the document if it doesn't exist
        }
      );
    
      return { depositionId: deposition._id, messages: deposition.messageHistory };
    } catch (err) {
      throw new Error(err.message || 'An error occurred during startDeposition');
    }
  };

  const endDeposition = async (depositionId) => {
    const date = Date.now();
    try {
      const result = await Deposition.findOneAndDelete({ _id: depositionId });
      if (!result) throw new Error('Deposition not found');
    const newDiscovery = result.attourney ? {
        type: 'Settlement',
        title: 'Settlement',
        content: 'Full Transcript of the settlement',
        exactContent: endSettlement(result, date),
        date,
        id: uuid()
    } : {
        type: 'Testimony',
        title: `Testimony Of ${result.subpoenee.name} (${result.subpoenee.role})`,
        content: `Full transcript of the deposition of ${result.subpoenee.name}`,
        exactContent: endDepositionTscrpt(result, date),
        date
    }
    
    await cases.updateOne({ _id: result.caseId, participants: { $elemMatch: { name: result.subpoenee.name, role: result.subpoenee.role } }}, { $set: { "participants.$.subpoena": false },  ...(newDiscovery.type === 'Settlement' ? [{
        $push: { dealHistory: newDiscovery.id }
      }] : []) });
    await cases.updateOne({ _id: result.caseId }, { $push : {discoveries: newDiscovery } });
    console.log(newDiscovery)
      return { success: true };
    } catch (err) {
      throw new Error(err.message || 'An error occurred during endDeposition');
    }
  };

  const sendMessage = async (message, depositionId) => {
    try {

      const deposition = await Deposition.findOne({ _id: depositionId });
      console.log(deposition, depositionId);
      if (!deposition) throw new Error('Deposition not found');
      const caseFound = await cases.findOne({_id: deposition.caseId});
      if (!caseFound) throw new Error('Deposition Not Found');
      const foundUser = await caseFound.participants.find(use => use.name == deposition.subpoenee.name && use.role == deposition.subpoenee.role);
    if (!foundUser) throw new Error('Participant Not Found');
    const realUser = await users.findOne({_id: caseFound.owners[0]});
    if (!realUser) throw newErr('Not Found', 404);
      const response = await openai.chat.completions.create({
        messages: [{ role: "user", content: SubpoenaMessagePrompt(deposition.attourney, foundUser, caseFound, message.message, deposition.messageHistory, realUser.reputation)}],
        model: "gpt-3.5-turbo-1106",
    });
      const aiMessage = JSON.parse(response.choices[0].message.content);
      const messageObj = {
        sender: deposition.subpoenee.name,
        message: aiMessage.message,
      };
  
      deposition.messageHistory.push(message);
      deposition.messageHistory.push(messageObj);
      console.log(aiMessage);
      await deposition.save();
  
      return {
        success: true,
        message: messageObj,
        stc: 200
      };
    } catch (error) {
      console.error('Error in sendMessage:', error);
      return {
        success: false,
        message: error.message || 'An error occurred while sending the message',
        stc: 500
      };
    }
  };



    const sendCourtMessage = async (message, hearingId) => {
    try {

      const deposition = await hearings.findOne({ _id: depositionId });
      console.log(deposition, depositionId);
      if (!deposition) throw new Error('Deposition not found');
      const caseFound = await cases.findOne({_id: deposition.caseId});
      if (!caseFound) throw new Error('Deposition Not Found');
      const foundUser = await caseFound.participants.find(use => use.name == deposition.subpoenee.name && use.role == deposition.subpoenee.role);
    if (!foundUser) throw new Error('Participant Not Found');
      const response = await openai.chat.completions.create({
        messages: [{ role: "user", content: SubpoenaMessagePrompt(deposition.attourney, foundUser, caseFound, message.message, deposition.messageHistory)}],
        model: "gpt-3.5-turbo-1106",
    });
      const aiMessage = JSON.parse(response.choices[0].message.content);
      const messageObj = {
        sender: deposition.subpoenee.name,
        message: aiMessage.message,
      };
  
      deposition.messageHistory.push(message);
      deposition.messageHistory.push(messageObj);
      console.log(aiMessage);
      await deposition.save();
  
      return {
        success: true,
        message: messageObj,
        stc: 200
      };
    } catch (error) {
      console.error('Error in sendMessage:', error);
      return {
        success: false,
        message: error.message || 'An error occurred while sending the message',
        stc: 500
      };
    }
  };
  
  module.exports = sendMessage;

const endSettlementProc = async (settlementId, uid) => {
  const date = Date.now();
  try {
    const result = await Deposition.findOneAndDelete({ _id: settlementId, attourney: true });
    if (!result) throw new Error('Settlement not found');
    const caseInfo = await cases.findOne({_id: result.caseId});
    const privilegedConvo = await Deposition.findOneAndDelete({caseId: caseInfo._id, privileged: true});
    const fetchedAdmin = await users.findOne({admin: true});
    if (!caseInfo || caseInfo.owners[0] !== uid) throw newErr('Case Not Found', 404)
      if (Object.keys(caseInfo.verdict).length !== 0) throw new Error('Case Already Concluded');
      console.log('launched')
  const newDiscovery = {
      type: 'Settlement',
      title: 'Settlement',
      content: 'Full Transcript of the settlement',
      exactContent: endSettlement(result, date),
      date,
      id: uuid()
  }
console.log(privilegedConvo)
  let res; 
  let finalVerdict;

  if (result.messageHistory.length < 2) {
    finalVerdict = {
      score: 0,
      verdict: 'Due to lack of cooperation, you have lost the case.',
      rptnpts: -20,
      compensation: -1000,
      status: 'lost',
      justification: 'Due to your negligence, you have lost the case.'
    }
  } else {
  res = await openai.chat.completions.create({
      messages: [{ role: "user", content: conclusion(caseInfo, result.messageHistory, privilegedConvo)}],
      model: "gpt-3.5-turbo-1106",
      response_format: {type: 'json_object'}
  });
  finalVerdict = JSON.parse(res.choices[0].message.content);
  }
  await cases.updateOne({_id: result.caseId}, {verdict: finalVerdict, $push: {discoveries: newDiscovery}});
  if (finalVerdict.compensation !== 0) {
    const transactionUpdate = {
        $inc: { balance: finalVerdict.compensation * 0.97 },
        $push: { income: { $each: [{ sender: fetchedAdmin._id, reason: `${caseInfo.title} Compensation`, amount: finalVerdict.compensation, date: Date.now() }], $position: 0 } }
    };
    await wallet.findOneAndUpdate({ owner: uid }, transactionUpdate);

    if (finalVerdict.compensation > 0) {
        await addAdminFee(finalVerdict.compensation * 0.03, 'Case Conclusion Fee', uid, Date.now());
    } else {
        await addAdminFee(-finalVerdict.compensation, 'Case Loss', uid, Date.now());
    }
}

console.log(finalVerdict.rptnpts)

await users.findOneAndUpdate({ _id: uid }, {
    $inc: { reputation: finalVerdict.reputationPoints },
    $pull: { cases: caseInfo._id },
    $push: { caseHistory: caseInfo._id }
});
  return {success: true}
  } catch (err) {
    console.log(err);
    throw new Error(err.message || 'An error occurred during endDeposition');
  }
}
module.exports = { endSettlementProc, getRepresentativeLawyer, endDeposition, startDeposition, sendMessage, fileMotion, issueSubpoena };
