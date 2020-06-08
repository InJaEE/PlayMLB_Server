const mongoose = require('mongoose');
const today = `${new Date().getFullYear}-${new Date().getMonth()+1}-${new Date().getDate()}`;


const visitor = new mongoose.Schema({
    total: {
        count: Number,
    },
    history: [{
        date: [{
            today: {
                type: Date,
                default:  today
            },
            count: Number,
            visitor: [{
                ip: String,
            }]
        }]
    }]
})

const visitorModel = mongoose.model('visitor', visitor);

module.exports = visitorModel;