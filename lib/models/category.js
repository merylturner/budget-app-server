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
    date: Date,
    expenses: [
        {
            name: {
                type: String,
                required: true
            },
            amount: {
                type: Number,
                required: true
            },
            date: Date,
        }
    ]
});

module.exports = mongoose.model('category', schema);