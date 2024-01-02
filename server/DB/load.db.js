const mongoose = require('mongoose');

const loadDb = () => {
    mongoose.connect('mongodb://127.0.0.1:27017/CaseQuestDB');
}



module.exports = loadDb;