const mongoose = require('mongoose');

const user = new mongoose.Schema({
    // 로그인 아이디
    userId: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    // 닉네임
    nickname: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
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