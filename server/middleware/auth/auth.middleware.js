const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('../../DB/models/user.model');
const user = mongoose.model('userModel');
const bcrypt = require('bcrypt')

const alreadyExists = async (req, res, next) => {
    try {
        const userFound = await user.find({username: req.body.username});
        userFound.length == 0 ? next() : res.status(400).json({success: false, message: 'Username Already in Use'});
    } catch (err) {
        return res.status(500).json({success: false, message: 'An Error Occured', err})
    }
}

const enc = async (pass) => {
    try {
        const saltRounds = 10;
        const hash = await bcrypt.hash(pass, saltRounds);
        console.log(hash);
        return hash;
    } catch (err) {
        return {message: "An Error has Occured", err }
    }
}

const signUp = async (req, res, next) => {
    const cred = req.body;

    try {
        cred.password = await enc(cred.password);
        console.log(cred);
        const newUser = new user(cred);
        await newUser.save();
        req.newUser = newUser;
        next(); // Send back the created user
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({success: false, err});
    }
}

module.exports = {alreadyExists, signUp, hasEmptyOrUndefined, signUp}