const { OpenAI } = require('openai');
const { config } = require('../config');
const openai = new OpenAI({apiKey: config.APIPASS});

const initiateCourt = (judge) => {
    return {
        sender: judge,
        message: 'The prosecution may now proceed to present their case.'
    }
}

const presentOtherSide = (judge) => {
    return {
        sender: judge,
        message: 'The Defense may now proceed to present their case.'
    }
}
module.exports = {presentOtherSide, initiateCourt}