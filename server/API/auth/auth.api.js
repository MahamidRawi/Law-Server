const express = require('express');
const { alreadyExists, validate } = require('../../middleware/auth/auth.middleware');
const { signUp, signIn } = require('../../actions/auth/auth.actions');
const router = express.Router();


router.post('/signup', alreadyExists, async (req, res) => {
    try {
        const signedUp = await signUp(req.body.credentials);
        return res.status(signedUp.stc).json(signedUp);
    } catch (err) {
        return res.status(err.stc).json(err);
    }
});

router.post('/signIn', async (req, res) => {
    try {
        const signed = await signIn(req.body.credentials);
        console.log(signed)
        return res.status(signed.stc || 200).json(signed);
    } catch (err) {
        console.log('Err : ', err);
        return res.status(err.stc || 500).json(err)
    }
});

router.post('/validate', validate, async (req, res) => res.json({success: true, message: 'Validated', info: req.uInfo}));

module.exports = router