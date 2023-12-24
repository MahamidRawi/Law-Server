const express = require('express');
const { validate } = require('../../middleware/auth/auth.middleware');
const { sendMail } = require('../../actions/main/mail.actions');
const router = express.Router();

router.post('/sendMail', validate, async (req, res) => {
    try {
        await sendMail(req.userId, req.body.targetMail, req.body.subject, req.body.body);
        return res.json({success: true});
    } catch (err) {
        return res.status(err.stc).json({message: err.message});
    }
});

module.exports = router;