const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GuideSchema = new mongoose.Schema({
    truth: {
        type: String,
        required: true
    },
    caseId: {
        type: String,
        required: true
    }
  });

mongoose.model('Guide', GuideSchema);
  