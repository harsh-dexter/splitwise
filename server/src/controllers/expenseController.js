const Group = require('../models/Group');
const Expense = require('../models/Expense');

async function createExpense(req, res) {
    try {
        const { groupId, title, amount, paidBy, participants } = req.body;
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ success: false, error: 'Group not found' });
        }
        const expense = await Expense.create({ groupId, title, amount, paidBy, participants });
        res.status(201).json({ success: true, data: expense });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}

async function getExpensesByGroup(req, res) {
    try {
        const expenses = await Expense.find({ groupId: req.params.groupId });
        res.status(200).json({ success: true, data: expenses });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
}

module.exports = { createExpense, getExpensesByGroup };


