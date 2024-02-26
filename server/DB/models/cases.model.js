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
    verdict: {
        type: Boolean,
        default: false
    },
    deal: {
        type: Object,
        default: {}
    },
    dealHistory: {
        type: Array,
        default: []
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
    ongoingDeal: {
        type: Boolean,
        default: false
    },
    owners: {
        type: Array,
        required: true,
    },
    status: {
        type: Boolean,
        default: false
    },
    
    date: {
        type: Date,
        default: Date.now()
    },
    
    courtDate: {
        type: Date,
    }
}, { versionKey: false });

mongoose.model('casesModel', CaseSchema);