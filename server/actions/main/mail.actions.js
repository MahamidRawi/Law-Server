require('../../DB/models/user.model');
const mongoose = require('mongoose');
const user = mongoose.model('userModel');
const { Err500 } = require('../../vars/vars');
const { mailSchema } = require('../../schemas/joi.schema');
const { cleanRes } = require('../../helper/res.helper');


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

            const notification = {
                sender: userFound.email === senderUserFound.email ? true : false,
                senderId: uid,
                senderMail: senderUserFound.email,
                targetMail: senderUserFound.email,
                subject,
                body,
                date: Date.now()
            };

            if (userFound.email === senderUserFound.email) {
                senderUserFound.notifications.unshift(notification);
                await senderUserFound.save();
                return resolve({ success: true });
            }

            userFound.notifications.unshift(notification);

            senderUserFound.notifications.unshift({
                sender: true,
                targetId: userFound._id,
                targetMail: targetMail,
                senderMail: senderUserFound.email,
                subject,
                body,
                date: Date.now()
            });

            // Save the changes to both documents
            await userFound.save();
            await senderUserFound.save();

            return resolve({ success: true });
        }).catch(err => reject({success: false, message: cleanRes(err.details[0].message), stc: 400}))
        } catch (err) {
            console.log(err);
            return reject({ success: false, message: Err500, stc: 500, err });
        }
    });
}

module.exports = {sendMail}