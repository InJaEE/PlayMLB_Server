const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const post = new mongoose.Schema({
    number: Number,
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30,
    },
    contents: {
        type: String,
        required: true,
        maxlength: 300,
    },
    views: {
        type: Number,
        default: 0,
    },
    comments: [{
        contents: {
            type: String,
            maxlength: 60,
        },
        createdBy: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }],
    recommend: [{
        recommendBy: {
            type: String,
        },
    }],
    createdBy: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: Date,
});

post.plugin(autoIncrement.plugin, {
    model: 'post',
    field: 'number',
    startAt: 1,
    increment: 1,
})

const postModel = mongoose.model('post', post);

module.exports = postModel;
