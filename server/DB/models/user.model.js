const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [4, 'Username must be at least 4 characters long'],
        maxlength: [20, 'Username must be less than 20 characters long']
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please use a valid email address'] 
    },

    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [1, 'First name must be at least 1 character long'],
        maxlength: [50, 'First name must be less than 50 characters long']
    },

    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [1, 'Last name must be at least 1 character long'],
        maxlength: [50, 'Last name must be less than 50 characters long']
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
    },

    wallet: {
        type: Array,
        default: []
    },
    
    score : {
        type: Number, 
        default: 0
    },

    balance: {
        type: Number,
        default: 10000
    },

    notifications: {
        type: Array,
        default: []
    },
});

mongoose.model('userModel', UserSchema);