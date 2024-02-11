const { issueSubpoenaPrompt, fileMotionPrompt } = require('../../../helper/openai.api.helper');
const { subpoenaSchema } = require('../../../schemas/joi.schema');
const mongoose = require('mongoose');
require('../../../DB/models/cases.model');
const cases = mongoose.model('casesModel');
const { compareBalanceToRequiredAmount, addAdminFee } = require('../wallet.actions');
const { OpenAI } = require('openai');
const { config } = require('../../../config');
const { calculatedPrices, lMPrices } = require('../../../vars/vars');

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

        // Define a function for making the request and parsing the response
        const makeRequestAndParseResponse = async (attempt = 0) => {
            console.log('retrying');
            const maxRetries = 3; // Maximum number of retries
            try {
                const response = await openai.chat.completions.create({
                    messages: [{ role: "system", content: issueSubpoenaPrompt(caseInfo, validSubpoenaType, subpoenaInfo.justification, subpoenaInfo.entity) }],
                    model: "gpt-3.5-turbo-1106",
                });

                // Attempt to parse JSON response
                console.log(response.choices[0].message.content);
                const parsedRes = JSON.parse(response.choices[0].message.content);
                return parsedRes; // Return parsed response if successful
            } catch (error) {
                if (error instanceof SyntaxError && attempt < maxRetries) {
                    // Retry if it's a JSON parsing error and attempts are below maxRetries
                    return makeRequestAndParseResponse(attempt + 1);
                } else {
                    // Throw error if not a JSON parsing error or retries exceeded
                    throw 'An Error has Occured. Please Try Again.';
                }
            }
        };

        // Use the defined function to make the request and handle retries for parsing
        const parsedRes = await makeRequestAndParseResponse();

        if (parsedRes.granted === false) return { success: false, message: parsedRes.rationale, stc: 400 };

        await addAdminFee(validSubpoenaType.price, `${validSubpoenaType.name} Fee`, uid, Date.now());
        if (validSubpoenaType.participant && parsedRes.participant.inList) {
            return { success: true, message: parsedRes.rationale, stc: 200 };
        } else {
            await cases.updateOne({ _id: caseFound._id }, { $push: validSubpoenaType.participant ? { participants: parsedRes.participant.details } : { discoveries: parsedRes.document } });
            return { success: true, message: parsedRes.rationale, stc: 200 };
        }
    } catch (err) {
        // Catch and return any error, including those from retries exceeding max attempts or other issues
        return { success: false, message: err.message || 'An error occurred', stc: 500 };
    }
};

const fileMotion = async (uid, caseInfo, motionInfo) => {
    console.log(motionInfo)
    try {
        await subpoenaSchema.validateAsync(motionInfo);

        const validMotion = lMPrices.find(motion => motion.name === motionInfo.type);
        console.log(validMotion)
        if (!validMotion) throw new Error('Invalid Motion Type');

        const sufficientBalance = await compareBalanceToRequiredAmount(uid, validMotion.price);
        if (sufficientBalance) throw new Error('Insufficient Balance');

        const caseFound = await cases.findOne({ _id: caseInfo._id });
        if (!caseFound) throw new Error('Case Not Found');

        // Define a function for making the request and parsing the response
        const makeRequestAndParseResponse = async (attempt = 0) => {
            console.log('retrying');
            const maxRetries = 3; // Maximum number of retries
            try {
                const response = await openai.chat.completions.create({
                    messages: [{ role: "system", content: fileMotionPrompt(caseInfo, validMotion.name, motionInfo.justification, motionInfo.entity) }],
                    model: "gpt-3.5-turbo-1106",
                });
                console.log(response.choices[0].message.content)
                const parsedRes = JSON.parse(response.choices[0].message.content);
                return parsedRes;
            } catch (error) {
                if (error instanceof SyntaxError && attempt < maxRetries) {
                    return makeRequestAndParseResponse(attempt + 1);
                } else {
                    console.log(error);
                    throw 'An Error has Occured. Please Try Again.';
                }
            }
        };

        const parsedRes = await makeRequestAndParseResponse();

        await addAdminFee(validMotion.price, `${validMotion.name} Fee`, uid, Date.now());
        await cases.updateOne({ _id: caseFound._id }, { $push: {discoveries: parsedRes.document} });
        console.log('HERE IS : ', parsedRes.rationale, parsedRes.granted)
        return { success: true, message: parsedRes.rationale, granted: parsedRes.granted, stc: 200 };
    } catch (err) {
        console.log(err);
        return { success: false, message: err.message || 'An error occurred', stc: 500 };
    }
}


module.exports = { fileMotion, issueSubpoena };
