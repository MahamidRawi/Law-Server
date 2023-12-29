require('../../DB/models/user.model');
require('../../DB/models/notification.model');
const mongoose = require('mongoose');
const user = mongoose.model('userModel');
const Mail = mongoose.model('mailModel');
const { Err500 } = require('../../vars/vars');
const { mailSchema } = require('../../schemas/joi.schema');
const { cleanRes } = require('../../helper/res.helper');
const { uuid } = require('uuidv4');



const sendMail = (uid, targetMail, subject, body) => {
    return new Promise(async (resolve, reject) => {
        try {
            mailSchema.validateAsync({targetMail, subject, body}).then(async (success) => {
            const userFound = await user.findOne({ email: targetMail });
            const senderUserFound = await user.findOne({ _id: uid });
            if (!userFound || !senderUserFound) {
                return reject({
                    success: false,
                    message: !userFound ? 'Email Address Not Found' : 'User Doesn\'t Exist',
                    stc: 404
                });
            }
            const toSelf = userFound.email === senderUserFound.email ? true : false

            const notification = {
                sender: toSelf,
                senderId: uid,
                to: userFound.email,
                from: senderUserFound.email,
                associated: [userFound.id, senderUserFound.id],
                targetId: userFound._id,
                subject,
                body,
                date: Date.now()
            };

            const createdNotification = new Mail(notification);
            await createdNotification.save();
            return resolve({ success: true });

        }).catch(err => console.log(err))
        } catch (err) {
            console.log(err);
            return reject({ success: false, message: Err500, stc: 500, err });
        }
    });
}

const getMails = async (uid) => {
    try {
        const notifications = await Mail.find({'associated': uid});
        return {success: true, notifications}
    } catch (err) {
        throw {success: false, stc: 500, notifications: null}
    }
}

const openMail = async (uid, targetMailId) => {
        try {
        const foundMail = await Mail.findById(targetMailId);
        if (!foundMail || !targetMailId) throw {success: false, message: !foundMail ? 'Mail Not Found' : 'No Mail Id Provided', stc: 404}

        if (foundMail.targetId === uid) {
            foundMail.opened = true
            await foundMail.save();
            return {success: true}
        }
        } catch (err) {
            throw {success: false, message: Err500, stc: 500, err}
        }
}

module.exports = {sendMail, openMail, getMails}