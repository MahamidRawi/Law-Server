const express = require('express');
const router = express.Router();
const { alreadyExists, validate } = require('../../middleware/auth/auth.middleware');
const { createCase } = require('../../actions/main/cases/cases.actions');
const { getCase } = require('../../actions/main/fetch.actions');
const { calculatedPrices, lMPrices } = require('../../vars/vars');
const { caseExists } = require('../../middleware/cases/cases.middleware');
const { issueSubpoena, fileMotion, sendMessage, startDeposition } = require('../../actions/main/cases/subpoena.actions');

router.post('/createCase', validate, (req, res) => createCase(req.userId, req.body.caseInfo).then(resp => res.json(resp)).catch(err => res.status(err.stc).json(err)));

router.get('/getCase', validate, (req, res) => getCase(req.headers['caseid'], req.userId).then(resp => res.json(resp)).catch(err => res.status(err.stc).json(err)));

router.get('/getSubpoenasPricings', validate, (req, res) => res.json({ success: true, calculatedPrices: req.headers['target'] == 'Subpoena' ? calculatedPrices : lMPrices }));

router.post('/issueSubpoena', validate, caseExists, async (req, res) => {
    try {
        const resp = await issueSubpoena(req.userId, req.caseInfo, req.body.subpoenaInfo);
        return res.status(resp.stc).json(resp);
    } catch (err) {
        return res.status(err.stc || 500).json({ message: err.message, stc: err.stc});
    }
});

router.post('/fileMotion', validate, caseExists, async (req, res) => {
    try {
        const resp = await fileMotion(req.userId, req.caseInfo, req.body.subpoenaInfo);
        return res.status(resp.stc).json(resp);
    } catch (err) {
        return res.status(err.stc || 500).json({ message: err.message, stc: err.stc});
    }
});

router.post('/deposition/startDeposition', async (req, res) => {
    const {caseId, subpoenee} = req.body;
    try {
        const resp = await startDeposition(caseId, subpoenee);
        return res.status(resp.stc || 200).json(resp);
    } catch (err) {
        return res.status(err.stc || 500).json({ message: err.message, stc: err.stc});
    }
});

router.post('/deposition/sendMessage', validate, async (req, res) => {
    const {depositionId, message, messageHistory} = req.body;
    try {
        const resp = await sendMessage(message, depositionId);
        return res.status(resp.stc).json(resp);
    } catch (err) {
        return res.status(err.stc || 500).json({ message: err.message, stc: err.stc});
    }
});



module.exports = router