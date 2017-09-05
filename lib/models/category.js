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
            type: Schema.Types.ObjectId,
            ref: 'Expense'
        }
    ]
});

module.exports = mongoose.model('category', schema);