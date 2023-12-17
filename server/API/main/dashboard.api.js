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
    const cases = getCases();
    return res.status(cases === true ? 200 : 500).json({cases, success: cases ? true : false});
});

router.get('/getUserInfo', validate, async (req, res) => {
    try {
        const resp = await getUser(req.userId);
        return res.status(resp.stc || 200).json(resp);
    } catch (err) {
        return res.status(500)
    }
})
module.exports = router;