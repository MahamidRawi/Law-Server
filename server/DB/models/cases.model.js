const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CaseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
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
    oppositionName: {
        type: String,
        required: true
    },
    
    discoveries: {
        type: Array,
        default: []
    },
    lawSystem: {
        type: String,
        default: 'Common Law (USA)'
    },
    verdict: {
        type: Object,
        default: {}
    },

    owners: {
        type: Array,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now()
    }
}, { versionKey: false });

mongoose.model('casesModel', CaseSchema);