const express = require('express');
const router = express.Router();
const { alreadyExists, validate } = require('../../middleware/auth/auth.middleware');
const { createCase } = require('../../actions/main/cases/cases.actions');
const { getCase } = require('../../actions/main/fetch.actions');

router.post('/createCase', validate, (req, res) => {
    createCase(req.userId, req.body.caseInfo).then(resp => res.json(resp)).catch(err => res.status(err.stc).json(err));
});

router.get('/getCase', validate, (req, res) => {
    const caseId = req.headers['caseid'];
    console.log('CASEID : ', caseId)
    console.log(req.userId)
    getCase(caseId, req.userId).then(resp => res.json(resp)).catch(err => res.status(err.stc).json(err));
});

module.exports = router