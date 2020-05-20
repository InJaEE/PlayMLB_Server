const mongoose = require('mongoose');

const user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
        unique: true,
    },
    provider: {
        type: String,
        default: 'local',
    },
    snsId: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const userModel = mongoose.model('User', user);

module.exports = userModel;