const { issueSubpoenaPrompt, fileMotionPrompt, SubpoenaMessagePrompt } = require('../../../helper/openai.api.helper');
const { subpoenaSchema } = require('../../../schemas/joi.schema');
const mongoose = require('mongoose');
require('../../../DB/models/cases.model');
const cases = mongoose.model('casesModel');
const { compareBalanceToRequiredAmount, addAdminFee } = require('../wallet.actions');
const { OpenAI } = require('openai');
const { config } = require('../../../config');
const { calculatedPrices, lMPrices } = require('../../../vars/vars');
const updateArray = require('../../../helper/obj.helper');
const { uuid } = require('uuidv4');
const generateSession = require('../../../helper/obj.helper');
require('../../../DB/models/depositions.model');
const Deposition = mongoose.model('Deposition');

const openai = new OpenAI({ apiKey: config.APIPASS });

const ongoingDepositions = []

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
      // Find the case by ID
      const caseFound = await cases.findOne({ _id: caseId });
      if (!caseFound) throw new Error('Case Not Found');
  
      // Find an existing deposition or create a new one if it doesn't exist
      let deposition = await Deposition.findOne({
        caseId: caseId,
        'subpoenee.name': subpoenee.name,
        'subpoenee.role': subpoenee.role
      });
  
      if (!deposition) {
        // If the deposition doesn't exist, create a new one
        deposition = new Deposition({
          caseId: caseId,
          subpoenee: subpoenee,
          messageHistory: []
        });
        await deposition.save();
      }
  
      return { depositionId: deposition._id };
    } catch (err) {
      throw new Error(err.message || 'An error occurred during startDeposition');
    }
  };

  const endDeposition = async (depositionId) => {
    try {
      // Remove the deposition from the database
      const result = await Deposition.deleteOne({ depositionId: depositionId });
      if (result.deletedCount === 0) throw new Error('Deposition not found');
  
      return { success: true };
    } catch (err) {
      throw new Error(err.message || 'An error occurred during endDeposition');
    }
  };

  const sendMessage = async (message, depositionId, messageHistory) => {
    try {

      const deposition = await Deposition.findOne({ depositionId: depositionId });
      if (!deposition) throw new Error('Deposition not found');
  
      
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messageHistory.concat([{ role: "user", content: message }]),
      });
  
      const aiMessage = response.data.choices[0].message.content;
      const messageObj = {
        sender: message.sender,
        message: aiMessage
      };
  
      deposition.messageHistory.push(messageObj);
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


module.exports = { endDeposition, startDeposition, sendMessage, fileMotion, issueSubpoena };
