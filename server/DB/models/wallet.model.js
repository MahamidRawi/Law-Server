const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletSchema = new Schema({
    income: {
        type: Array,
        default: []
    },

    expenses: {
        type: Array,
        default: []
    },

    balance: {
        type: Number,
        default: 10000
    },

    invoices: {
        type: Array,
        default: []
    },

    owner: {
        type: String,
    }
});


mongoose.model('walletModel', WalletSchema);