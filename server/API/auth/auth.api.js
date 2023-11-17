const express = require('express');
const { alreadyExists, signUp } = require('../../middleware/auth/auth.middleware');
const router = express.Router();

router.post('/signup', alreadyExists, signUp, (req, res) => {
    // console.log(req.body)
    return res.json(req.newUser);
});

module.exports = router