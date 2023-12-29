const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MailSchema = new Schema({
    from: {
        type: String,
        required: true
    },

    to: {
        type: String,
        required: true
    },

    subject: {
        type: String,
        required: true
    },

    body: {
        type: String,
        required: true
    },

    sender: {
        type: Boolean,
        required: true
    },

    senderId: {
        type: String,
        required: true
    },

    targetId: {
        type: String,
        required: true
    },

    opened: {
        type: Boolean,
        default: false
    },

    associated: {
        type: Array,
        default: []
    },

    date: {
        type: Date,
        required: true
    }

})

mongoose.model('mailModel', MailSchema);