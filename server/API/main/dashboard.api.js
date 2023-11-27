const express = require('express');
const router = express.Router();
const { validate } = require('../../middleware/auth/auth.middleware');
const { createCase, getCases, getUser, getUsers } = require('../../actions/main/fetch.actions');

router.get('/fetchHomePage', validate, async (req, res) => {
    const data = {
        userInfo: await getUser(req.userId).catch(err => res.status(500).json(err)),
        userCases: await getCases(req.userId).catch(err => res.status(500).json(err)),
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