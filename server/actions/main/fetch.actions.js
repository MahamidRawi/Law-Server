const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { Err500 } = require('../../vars/vars');
require('../../DB/models/cases.model');
require('../../DB/models/user.model');
const cases = mongoose.model('casesModel');
const users = mongoose.model('userModel');


const getCases = (uid) => {
    return new Promise(async (resolve, reject) => {
    try {
        const response = await cases.find({owners: {$in: [uid]}})
        return resolve({success: true, cases: response});
    } catch(err) {
        return reject({success: false, message: Err500, err});
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

    newCase.save().then(res => true).catch(err => Err500)
}

const getUser = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userFound = await users.findOne({_id: id}).select('-password');
            if (!userFound) return reject({success: false, stc: 404, message: 'No User Found'})
            return resolve({success: true, info: userFound});
    } catch (err) {
            return reject({success: false, message: Err500, err});
        }
    })
}

const getUsers = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            return resolve(await users.find({}).select('-password'));
        } catch (err) {
            return reject({success: false, message: Err500, err})
        }
    })
}

module.exports = {getCases, createCase, getUser, getUsers}