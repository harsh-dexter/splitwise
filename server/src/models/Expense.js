const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    paidBy: { type: String, required: true },
    participants: { type: [String], required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Expense', ExpenseSchema);


