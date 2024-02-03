const { issueSubpoenaPrompt } = require('../../../helper/openai.api.helper');
const { subpoenaSchema } = require('../../../schemas/joi.schema');
const mongoose = require('mongoose');
require('../../../DB/models/cases.model');
const cases = mongoose.model('casesModel');
const { compareBalanceToRequiredAmount, addAdminFee } = require('../wallet.actions');
const { OpenAI } = require('openai');
const { config } = require('../../../config');
const { calculatedPrices } = require('../../../vars/vars');

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

        const response = await openai.chat.completions.create({
            messages: [{ role: "system", content: issueSubpoenaPrompt(caseInfo, validSubpoenaType, subpoenaInfo.justification, subpoenaInfo.entity) }],
            model: "gpt-3.5-turbo-1106",
        });

        const parsedRes = JSON.parse(response.choices[0].message.content);
        if (parsedRes.granted === false) return {success: false, message: parsedRes.rationale, stc: 400}

        await addAdminFee(validSubpoenaType.price, `${validSubpoenaType.name} Fee`, uid, Date.now());
        console.log('Here it is', parsedRes)
        if (validSubpoenaType.participant || parsedRes.inList) {
            return { success: true, message: parsedRes.rationale, stc: 200 };
        } else {
            await cases.updateOne({ _id: caseFound._id }, { $push: validSubpoenaType.participant ? { participants: parsedRes.participant.details } : { discoveries: parsedRes.document } });
            return { success: true, message: parsedRes.rationale, stc: 200 };
        }
    } catch (err) {
        console.log(err);
        return { success: false, message: err.message || 'An error occurred', stc: 500 };
    }
};

module.exports = { issueSubpoena };
