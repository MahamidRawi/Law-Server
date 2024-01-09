const {createCasePrompt} = require('../../../helper/openai.api.helper');
const {caseSchema} = require('../../../schemas/joi.schema');

const mongoose = require('mongoose');
require('../../../DB/models/cases.model');
require('../../../DB/models/user.model');
const cases = mongoose.model('casesModel');
const users = mongoose.model('userModel');
const { addAdminFee, compareBalanceToRequiredAmount } = require('../wallet.actions');
const { OpenAI } = require('openai');
const { config } = require('../../../config');
const openai = new OpenAI({apiKey: config.APIPASS});

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
    const date = Date.now();
    return new Promise(async (resolve, reject) => {
        const {lawSystem, difficulty, position, fieldOfLaw} = caseInfo;
        caseSchema.validateAsync({lawSystem, difficulty, position, fieldOfLaw}).catch(err => reject({success: false, message: err.message, stc: 400}))
        const userFound = await users.findOne({_id: uid}).catch(err => reject({stc: 500, message: 'An Error has Occured'}));
        const sufficientBalance = compareBalanceToRequiredAmount(uid, 250);
        if (!userFound || userFound.cases.length === 3 || !sufficientBalance) reject({message: !userFound ? 'User Not Found': cases.length === 3 ?'You are already handeling 3 ongoing cases' : 'Insufficient Balance', stc: !userFound ? 401 : 400});
        // caseSchema.validateAsync(fieldOfLaw, lawSystem,position, difficulty);
        const response = await openai.chat.completions.create({
            messages: [{ role: "system", content: createCasePrompt(uid, caseInfo) }],
    model: "gpt-3.5-turbo",
        });
        const newCase = new cases(JSON.parse(response.choices[0].message.content));
        newCase.lawSystem = lawSystem;
        newCase.owners = [uid, 'AI'];
        newCase.difficulty = difficulty;
        
if (position === 'prosecution') {
  newCase.prosecution = uid;
  newCase.defense = 'AI';
} else if (position === 'defense') {
  newCase.prosecution = 'AI';
  newCase.defense = uid;
} else { // position is random
  if (Math.random() < 0.5) {
      newCase.prosecution = uid;
      newCase.defense = 'AI';
  } else {
      newCase.prosecution = 'AI';
      newCase.defense = uid;
  }
}
        newCase.save().then(async suc => {
        await addAdminFee(250, 'Case Generation Fee', uid, date);
        await addCaseToUser(uid, suc._id);
        return resolve({success: true, message: 'Case Generated Successfully'});
    }).catch(err => reject({success: false, message: 'An Error has Occured', stc: 500, err}));
    });
}

module.exports = {createCase}