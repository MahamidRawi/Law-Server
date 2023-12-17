const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('../../DB/models/user.model');
const user = mongoose.model('userModel');


const alreadyExists = async (req, res, next) => {
    const {username,email} = req.body.credentials
    try {
        const userFound = await user.find({$or: [{username}, {email}]});;
        userFound.length == 0 ? next() : res.status(400).json({success: false, message: username == userFound[0].username ? 'Username Already in Use' : 'Email Already in Use'});
    } catch (err) {
        return res.status(500).json({success: false, message: 'An Error Occured', err})
    }
}

const validate = (req, res, next) => {

    const token = req.headers['x-access-token']
    
    if (!token) return res.status(401).json({ validated: false, errors: [{text:"No token was provided"}] });

    jwt.verify(token, process.env.JWTPASS, (err, decoded) => {
        
        if (err) return res.status(401).json({success: false, message: "Failed To Authenticate"});

        req.userId = decoded.UID

        return next();
    });
}

module.exports = {alreadyExists, validate}