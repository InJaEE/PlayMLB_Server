const mongoose = require('mongoose');

console.log(mongoose.Schema.Types.ObjectId);

const post = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    contents: {
        type: String,
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: Date,
});

const postModel = mongoose.model('post', post);

export default postModel;
