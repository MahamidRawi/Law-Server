const express = require('express');
const { alreadyExists, signUp } = require('../../middleware/auth/auth.middleware');
const router = express.Router();

router.post('/signup', alreadyExists, signUp, (req, res) => {
    // console.log(req.body)
    signUp(req.body)
});

module.exports = router