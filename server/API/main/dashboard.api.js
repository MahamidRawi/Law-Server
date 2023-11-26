const express = require('express');
const router = express.Router();
const { validate } = require('../../middleware/auth/auth.middleware');
const { createCase, getCases } = require('../../actions/main/fetch.actions');


router.post('/createCase', async (req, res) => {
    createCase();
});

router.get('/getMyCases', async (req, res) => {
    getCases('123456')
});

module.exports = router;