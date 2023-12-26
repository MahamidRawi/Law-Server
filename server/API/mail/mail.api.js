const express = require('express');
const { validate } = require('../../middleware/auth/auth.middleware');
const { sendMail, openMail, getMails } = require('../../actions/main/mail.actions');
const router = express.Router();

router.post('/sendMail', validate, async (req, res) => {
    try {
        await sendMail(req.userId, req.body.targetMail, req.body.subject, req.body.body);
        return res.json({success: true});
    } catch (err) {
        return res.status(err.stc).json({message: err.message});
    }
});

router.get('/getMails', validate, async (req, res) => {
    try {
       const {notifications} = await getMails(req.userId);
       return res.json({success: true, notifications, ud: req.userId});
    } catch (err) {
        return res.status(err.stc).json({success: false, message: 'An Error has Occured'});
    }
})

router.post('/openMail', validate, async (req, res) => {
    try {
        await openMail(req.userId, req.body.targetMailId);
        return res.json({success: true});
    } catch (err) {
        return res.status(err.stc).json({message: err.message, success: false});
    }
});

module.exports = router;