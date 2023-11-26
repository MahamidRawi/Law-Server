const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CaseSchema = new Schema({
    defense: {
        type: String,
        required: true
    },
    prosecution: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true,
    },
    participants: {
        type: Array,
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
    }, 
    owners: {
        type: Array,
        required: true,
    }
});

mongoose.model('casesModel', CaseSchema);