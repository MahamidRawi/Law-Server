const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('../../DB/models/cases.model');
const cases = mongoose.model('casesModel');

const getCases = (uid) => {
    return new Promise(async (resolve, reject) => {
    try {
        const response = await cases.find({owners: {$in: [uid]}})
        console.log(response);
        return {success: true, cases: response};
    } catch(err) {
        return {success: false, message: 'An Error has Occured', err};
    }
});
}

const createCase = () => {
    const newCase = new cases({
        defense: 'Defense Attorney',
        prosecution: 'Prosecution Attorney',
        summary: 'This is a summary of the case.',
        participants: ['Participant 1', 'Participant 2'],
        difficulty: 'Medium',
        owners: ['123456', 'Owner 2'],
      })

    newCase.save().then(res => console.log(res)).catch(err => 'An Error Occured')
}

module.exports = {getCases, createCase}