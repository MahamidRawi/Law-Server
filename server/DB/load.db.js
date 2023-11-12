const mongoose = require('mongoose');

const loadDb = () => {
    mongoose.connect('mongodb://127.0.0.1:27017/testiung');
}

module.exports = loadDb;