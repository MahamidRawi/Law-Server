const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('../../DB/models/user.model');
require('../../DB/models/wallet.model');
const wallet = mongoose.model('walletModel');
const user = mongoose.model('userModel');
const bcrypt = require('bcryptjs');
const { authSchema, inAuthSchema } = require('../../schemas/joi.schema');
const { cleanRes } = require('../../helper/res.helper');
const enc = require('../../helper/auth.helper');


const signUp = async (creds) => {
    return new Promise(async(resolve, reject) => {
    const {password} = creds;
    const formvalidation = authSchema.validate(creds);

    if (formvalidation.error) return reject({
            stc: 400,
            success: false, 
            message: formvalidation.error.details[0].message
        });

    try {
        creds.password = await enc(password);
        const newWallet = await new wallet().save();
        creds.wallet = newWallet._id;
        const newUser = await new user(creds).save();
        newWallet.owner = newUser._id;
        await newWallet.save();
        // newWallet.owner = newUser._id;
        return resolve({stc: 200, success: true, message: 'You have been Signed Up Successfully'})
    } catch (err) {
        console.error("Error creating user:", err);
        return reject({stc: 500, success: false, err, message: 'An Error has Occured'});
    }
});
}

const signIn = async (creds) => {

    const {email, password} = creds
    return new Promise(async (resolve, reject) => {
        inAuthSchema.validateAsync({email, password}).catch(err => reject({success: false, message: cleanRes(err.details[0].message), stc : 400}));
        try {
            const foundUser= await user.findOne({email});
            console.log(foundUser)
            if (!foundUser) return reject({success: false, message: 'No User Found', stc: 404})
            const passwordsMatch = bcrypt.compareSync(password, foundUser.password);

            passwordsMatch ? resolve({success: true, stc: 200, message: 'Authenticated Successfully', token: jwt.sign({ UID: foundUser.id }, process.env.JWTPASS, { expiresIn: 86400 * 160 })}) : reject({stc: 404, message: 'Invalid Password', success: false})
        } catch (err) { console.log(err); return reject({success: false, message: 'An Error has Occured', stc:500})}
        
    });
}

module.exports = {signIn, signUp}