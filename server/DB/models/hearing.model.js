const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HearingSchema = new Schema({
    caseId: {
        type: String,
        required: true
    },
    transcript: {
        type: Array,
        default: []
    },
    judge: {
        type: Object,
        required: true
    },
    rested: {
        type: Boolean,
        default: false
    }
});

mongoose.model('HearingModel', HearingSchema);