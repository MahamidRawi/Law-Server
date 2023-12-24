const express = require('express');
const router = express.Router();
const MailRouter = require('../mail/mail.api');
const { validate } = require('../../middleware/auth/auth.middleware');
const { createCase, getCases, getUser, getUsers } = require('../../actions/main/fetch.actions');

router.use('/mail', MailRouter);

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
    return res.status(cases.success == true ? 200 : 500).json({cases, success: cases ? true : false});
});

router.get('/getLawyers', validate, async (req, res) => {
    const {users, success} = await getUsers();
    console.log(users)
    return res.status(success ? 200 : 500).json({users, success});
});

router.get('/getUserInfo', validate, async (req, res) => {
    try {
        const resp = await getUser(req.userId);
        return res.status(resp.stc || 200).json(resp);
    } catch (err) {
        return res.status(500)
    }
})

router.get('/getLawyer', validate, async (req, res) => {
    const targetId = req.headers['targetid'];
    try {
        const resp = await getUser(targetId, 'balance');
        return res.status(resp.stc || 200).json(resp);
    } catch (err) {
        return res.status(500);
    }
});
module.exports = router;