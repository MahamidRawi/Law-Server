const { OpenAI } = require('openai');
const { config } = require('../config');
const openai = new OpenAI({apiKey: config.APIPASS});

const initiateCourt = (judge) => {
    return {
        sender: judge,
        message: 'The Prosecution may now proceed to present their closing arguments.'
    }
}

const presentOtherSide = (judge) => {
    return {
        sender: judge,
        message: 'The Defense may now proceed to present their closing arguments.'
    }
}
module.exports = {presentOtherSide, initiateCourt}