const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const post = new mongoose.Schema({
    number: Number,
    title: {
        type: String,
        required: true,
        trim: true,
    },
    contents: {
        type: String,
        required: true,
    },
    writer: {
        type: String,
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    comments: [{
        contents: String,
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }],
    recommend: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: Date,
    createdBy: {
        
    }
});

post.plugin(autoIncrement.plugin, {
    model: 'post',
    field: 'number',
    startAt: 1,
    increment: 1,
})

const postModel = mongoose.model('post', post);

module.exports = postModel;
