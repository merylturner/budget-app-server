const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    expenses: [
        {
            name: {
                type: String,
                required: true
            },
            budget: {
                type: Number,
                required: true
            },
            date: {
                type: Date,
                required: true
            }
        }
    ]
});

module.exports = mongoose.model('category', schema);