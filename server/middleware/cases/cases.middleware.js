const mongoose = require('mongoose');
require('../../DB/models/cases.model');
const cases = mongoose.model('casesModel');

const caseExists = async (req, res, next) => {
    try {
        const caseFound = await cases.findOne({_id: req.body.caseId});
        if (!caseFound || !caseFound.owners.includes(req.userId)) return res.status(!caseFound ? 404 : 401).json({success: false, message: !caseFound ? 'Case Not Found' : 'The Case Isn\'t Yours'});
        req.caseInfo = caseFound
        return next();
    } catch (err) {
        return res.status(500).json({success: false, message: 'An Error has Occured'});
    }
}

module.exports = {caseExists}