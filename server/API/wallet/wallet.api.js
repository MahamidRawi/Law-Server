const express = require('express');
const { validate } = require('../../middleware/auth/auth.middleware');
const { getWallet } = require('../../actions/main/fetch.actions');
const { transferMoney } = require('../../actions/main/wallet.actions');
const { sendMail } = require('../../actions/main/mail.actions');
const { transactionMessageSuccess } = require('../../vars/vars');
const router = express.Router();

router.get('/getWallet', validate, async (req, res) => {
    try {
        const resp = await getWallet(req.userId);
        return res.json({ wallet: resp.wallet });
    } catch (err) {
        return res.status(err.stc).json(err);
    }
});

router.post('/transfer', validate, async (req, res) => {
    try {
        const uid = req.userId;
        console.log(req.body)
        const {transactionInfo} = req.body
        const { senderName, targetName, date, targetMail} = await transferMoney(uid, transactionInfo);
        const message = transactionMessageSuccess(senderName, targetName, transactionInfo.amount, transactionInfo.reason, date);
        await sendMail(uid, targetMail, 'Transaction', message);
        return res.json({success: true, message: 'Transaction Completed Successfully'});
    } catch (err) {
        console.log(err);
        return res.status(err.stc).json(err);
    }
})

module.exports = router;