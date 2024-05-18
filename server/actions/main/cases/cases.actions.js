const {createCasePrompt, prosecutionFirstMessage, correspondingResponse, opposingTeamTurn, verdict, createDiscoveriesPrompt} = require('../../../helper/openai.api.helper');
const {caseSchema} = require('../../../schemas/joi.schema');
require('../../../DB/models/cases.model');
require('../../../DB/models/hearing.model');
require('../../../DB/models/user.model');
const mongoose = require('mongoose');
const wallet = mongoose.model('walletModel');
const cases = mongoose.model('casesModel');
const users = mongoose.model('userModel');
const hearings = mongoose.model('HearingModel');
const { addAdminFee, compareBalanceToRequiredAmount } = require('../wallet.actions');
const { OpenAI } = require('openai');
const { config } = require('../../../config');
const ObjHelper = require('../../../helper/obj.helper');
const { judges, generateInstantLossVerdict } = require('../../../vars/vars');
const { initiateCourt, presentOtherSide } = require('../../../helper/court.helper');
const openai = new OpenAI({apiKey: config.APIPASS});
require('../../../DB/models/depositions.model');
const Deposition = mongoose.model('Chat');

const newErr = (message, stc) => {
  const error = new Error(message);
  error.stc = stc
  return error
}

const addCaseToUser = async (tId, caseId) => {
    const userCasesUpdate = {
        $push: {
          cases: {
            $each: [caseId],
            $position: 0, // Insert at the beginning of the array
          },
        },
      };

    return await users.updateOne({ _id: tId }, userCasesUpdate).exec()

}

const createCase = async (uid, caseInfo) => {
    return new Promise(async (resolve, reject) => {
        const {lawSystem, difficulty, fieldOfLaw, position} = caseInfo;
        chosenPosition = position == 'random' ? ObjHelper.randomPosition() : position;
        caseSchema.validateAsync({lawSystem, difficulty, position, fieldOfLaw}).catch(err => reject({success: false, message: err.message, stc: 400}))
        const userFound = await users.findOne({_id: uid}).catch(err => reject({stc: 500, message: 'An Error has Occured'}));
        const sufficientBalance = compareBalanceToRequiredAmount(uid, 250);
        if (!userFound || userFound.cases.length === 3 || !sufficientBalance) reject({message: !userFound ? 'User Not Found': cases.length === 3 ?'You are already handeling 3 ongoing cases' : 'Insufficient Balance', stc: !userFound ? 401 : 400});
        const response = await openai.chat.completions.create({
            messages: [{role: "system", content: "You are the creator of the cases"}, { role: "user", content: createCasePrompt(uid, caseInfo, chosenPosition)}],
    model: "ft:gpt-3.5-turbo-1106:personal:create-case-v1:90FyhbPu",
    response_format: {type: 'json_object'}

        });
        const newRes = JSON.parse(response.choices[0].message.content);
        const caseSolution = newRes.solution;
        // delete newRes.solution;
        const discoveries = await openai.chat.completions.create({
          messages: [{role: "system", content: "You are the creator of the discoveries"}, { role: "user", content: createDiscoveriesPrompt(newRes.discoveries, caseSolution)}],
  model: "gpt-4o",
  response_format: { type: "json_object" },
      });
      console.log(discoveries.choices[0].message.content);

      newRes.discoveries = JSON.parse(discoveries.choices[0].message.content).discoveries;
      console.log(newRes.discoveries)  
      const newCase = new cases(newRes);
        newCase.lawSystem = lawSystem;
        newCase.owners = [uid, newRes.oppositionName];
        newCase.difficulty = difficulty;
        
if (chosenPosition === 'prosecution') {
  newCase.prosecution = uid;
  newCase.defense = newRes.oppositionName;
} else if (chosenPosition === 'defense') {
  newCase.prosecution = newRes.oppositionName;
  newCase.defense = uid;
}

        const oplawyer = ObjHelper.generateLawyer(newRes.oppositionName, chosenPosition == 'defense' ? 'Prosecution' : 'Defense');
        newCase.participants.push(oplawyer);
        const newdate = Date.now();
        const courtdate = newdate + 57600000;
        newCase.date = newdate
        newCase.courtDate = courtdate
        newCase.save().then(async suc => {
        await addAdminFee(250, 'Case Generation Fee', uid, newdate);
        await addCaseToUser(uid, suc._id);
        return resolve({success: true, message: 'Case Generated Successfully'});
    }).catch(err => console.log(err));
    });
}

//reject({success: false, message: 'An Error has Occured', stc: 500, err})
const endHearing = async (hearingId, uid) => {
  console.log(hearingId, uid);
  try {
      const fetchedAdmin = await users.findOne({ admin: true });
      const hearing = await hearings.findOne({ _id: hearingId });
      if (!hearing) throw new Error('Hearing Not Found');

      const caseFound = await cases.findOne({ _id: hearing.caseId });
      if (!caseFound) throw new Error('Case Not Found');
      if (caseFound.owners[0] !== uid) throw new Error('Unauthorized Access');
      if (Object.keys(caseFound.verdict).length !== 0) throw new Error('Case Already Concluded');

      const depos = await Deposition.find({ caseId: caseFound.id,  });
      const designatedJudge = judges.find(judge => judge.name === hearing.judge);
      const requiredMinimumLength = caseFound.prosecution === uid ? 3 : 4;

      let finalVerdict;
      if (hearing.transcript.length < requiredMinimumLength) {
          finalVerdict = generateInstantLossVerdict(caseFound, uid);
      } else {
          const maxRetries = 5;
          for (let attempt = 0; attempt < maxRetries; attempt++) {
              try {
                  const response = await openai.chat.completions.create({
                      messages: [{ role: "system", content: verdict(hearing, caseFound, designatedJudge, depos) }],
                      model: "gpt-4o",
                      response_format: {type: 'json_object'}
                  });
                  finalVerdict = JSON.parse(response.choices[0].message.content);
                  break; // If parsing succeeds, exit the loop
              } catch (parseError) {
                  console.error(`Failed to parse response on attempt ${attempt + 1}: ${parseError}`);
                  if (attempt === maxRetries - 1) throw new Error('Failed to obtain a valid response from OpenAI after several attempts');
              }
          }
      }

      await cases.findOneAndUpdate({ _id: caseFound._id }, { verdict: finalVerdict });

      if (finalVerdict.compensation !== 0) {
          const transactionUpdate = {
              $inc: { balance: finalVerdict.compensation * 0.97 },
              $push: { income: { $each: [{ sender: fetchedAdmin._id, reason: `${caseFound.title} Compensation`, amount: finalVerdict.compensation * 0.97, date: Date.now() }], $position: 0 } }
          };
          await wallet.findOneAndUpdate({ owner: uid }, transactionUpdate);

          if (finalVerdict.compensation > 0) {
              await addAdminFee(finalVerdict.compensation * 0.03, 'Case Conclusion Fee', uid, Date.now());
          } else {
              await addAdminFee(-finalVerdict.compensation, 'Case Loss', uid, Date.now());
          }
      }

      await users.findOneAndUpdate({ _id: uid }, {
          $inc: { reputation: finalVerdict.rptnpts },
          $pull: { cases: caseFound._id },
          $push: { caseHistory: caseFound._id }
      });
  } catch (err) {
      console.error(err);
      throw new Error(err.message || 'An error has occurred');
  }
}

const startHearing = async (caseId, uid) => {
  try {
    const caseFound = await cases.findOne({_id: caseId});
    if (!caseFound || caseFound.owners[0] !== uid) return newErr('Case Not Found', 404);
    const hearingFound = await hearings.findOne({caseId});
    if (hearingFound) return {hearingId: hearingFound._id, transcript: hearingFound.transcript, judge: hearingFound.judge}
    const designatedJudge = judges.filter(judge => judge.difficulty == caseFound.difficulty)
    const judge = designatedJudge[Math.floor(Math.random() * designatedJudge.length)].name
    const resp = uid !== caseFound.prosecution ? await openai.chat.completions.create({
      messages: [{ role: "system", content: prosecutionFirstMessage(caseFound) }],
      model: "gpt-3.5-turbo-1106",
  }) : false;

  const initialTranscript = caseFound.prosecution !== uid ? [
    initiateCourt(judge),
    {
      sender: caseFound.oppositionName,
      message: JSON.parse(resp.choices[0].message.content).message
    }, 
    presentOtherSide(judge)
  ] : [
    initiateCourt(judge)
  ];

    const hearing = await hearings.findOneAndUpdate(
      {
        caseId: caseId,
      },
      {
        $setOnInsert: { transcript: initialTranscript, judge}
      },
      {
        new: true,
        upsert: true
      }
    );
    return {hearingId: hearing._id, transcript: hearing.transcript, judge}
  } catch (err) {
    console.log(err);
    throw newErr(err | 'An Erro has Occured', 500);
  }
}

const handleMessage = async (hearingId, message, userId) => {
  console.log(hearingId);
  try {
    const hearing = await hearings.findOne({ _id: hearingId });
    if (!hearing) throw newErr('Hearing not found', 404);

    const user = await users.findOne({ _id: userId });
    if (!user) throw newErr('User not found', 404);

    const caseDetails = await cases.findOne({ _id: hearing.caseId });
    if (!caseDetails || caseDetails.owners[0] !== userId) {
      throw newErr('Unauthorized or case not found', 403);
    }

    hearing.transcript.push(message);
    await hearing.save();

    const judge = judges.find(judge => judge.name === hearing.judge);
    const systemMessage = correspondingResponse(caseDetails, judge, message, hearing.transcript);

    const response = await openai.chat.completions.create({
      messages: [{ role: "system", content: systemMessage }],
      model: "gpt-3.5-turbo-1106",
    });

    console.log(response.choices[0].message)

    const parsedResponse = JSON.parse(response.choices[0].message.content);
    parsedResponse.map(msg => {
      hearing.transcript.push(msg);
    });
    const saved = await hearing.save()
    return {message: parsedResponse, newHistory: saved.transcript}
  } catch (err) {
    console.error(err);
    // Ensure newErr is a function that correctly formats your error responses.
    throw newErr(err.message || 'An error has occurred', 500);
  }
};

const rest = async (hearingId, uid) => {
  let parsedResponse;
  try {
    const hearing = await hearings.findOne({ _id: hearingId });
    if (!hearing) throw newErr('Hearing not found', 404);

    if (hearing.rested) return {message: []}

    const user = await users.findOne({ _id: uid });
    if (!user) throw newErr('User not found', 404);

    const caseDetails = await cases.findOne({ _id: hearing.caseId });
    if (!caseDetails || !caseDetails.owners.includes(uid)) {
      throw newErr('Unauthorized or case not found', 403);
    }
    const status = await caseDetails.prosecution == uid ? 'Prosecution' : 'Defense'
    
    const judge = judges.find(judge => judge.name === hearing.judge);
    hearing.transcript.push({sender: `${user.firstName} ${user.lastName}`, message: `${status} rests.`});

    if (!hearing.transcript.length <= 2) {
      
      const systemMessage = opposingTeamTurn(caseDetails, status, hearing.transcript, judge, `${user.firstName} ${user.lastName}`);
      
      const response = await openai.chat.completions.create({
        messages: [{ role: "system", content: systemMessage }],
        model: "gpt-3.5-turbo-1106",
      });
      // console.log(response.choices[0].message.content);
      parsedResponse = JSON.parse(response.choices[0].message.content);
      console.log(parsedResponse)
      parsedResponse.map(msg => {
        hearing.transcript.push(msg);
      });
      hearing.rested = true;
    }
    
    await hearing.save();
    return {message: parsedResponse}
  } catch (err) {
    throw newErr(err.message || 'An error has occurred', 500);
  }
}

module.exports = {endHearing, rest, handleMessage, createCase, startHearing}