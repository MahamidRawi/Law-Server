const express = require('express');
const router = express.Router();
const { alreadyExists, validate } = require('../../middleware/auth/auth.middleware');


router.get('/dashboard', validate, async (req, res) => {
    
});

