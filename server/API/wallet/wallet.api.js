const express = require('express');
const { validate } = require('../../middleware/auth/auth.middleware');
const { getWallet } = require('../../actions/main/fetch.actions');
const router = express.Router();

router.get('/getWallet', validate, async (req, res) => {
    try {
        const resp = await getWallet(req.userId);
        return res.json({ wallet: resp.wallet });
    } catch (err) {
        return res.status(err.stc).json(err);
    }
});

module.exports = router;