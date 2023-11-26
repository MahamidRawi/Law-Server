const express = require('express');
const router = express.Router();
const { validate } = require('../../middleware/auth/auth.middleware');
const { createCase, getCases, getUser } = require('../../actions/main/fetch.actions');

router.get('/fetchHomePage', validate, async (req, res) => {
    getUser(req.userId);
    
    const data = {
        userInfo: await getUser(req.userId),
        userCases: await getCases(req.userId),
        success: (await getUser(req.userId)).success && (await getCases(req.userId)).success
    }

    return res.json(data);
});

router.post('/createCase', async (req, res) => {
    createCase();
});

router.get('/getMyCases', validate, async (req, res) => {
    getCases(req.userId);
});

module.exports = router;