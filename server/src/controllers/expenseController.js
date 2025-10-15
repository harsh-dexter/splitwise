const Group = require('../models/Group');
const Expense = require('../models/Expense');

const User = require('../models/User'); // Add User model import

async function createExpense(req, res) {
    try {
        const { groupId, title, amount, paidBy, participants } = req.body;
        const me = await User.findById(req.user.userId).select('name email');
        const identifier = me?.name || me?.email;
        // Check if the user is a member of the group
        const group = await Group.findOne({ _id: groupId, members: identifier });
        if (!group) {
            return res.status(404).json({ success: false, error: 'Group not found or user is not a member' });
        }
        const expense = await Expense.create({ groupId, title, amount, paidBy, participants });
        res.status(201).json({ success: true, data: expense });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}

async function getExpensesByGroup(req, res) {
    try {
        const me = await User.findById(req.user.userId).select('name email');
        const identifier = me?.name || me?.email;
        const group = await Group.findOne({ _id: req.params.groupId, members: identifier });
        if (!group) {
            return res.status(404).json({ success: false, error: 'Group not found or user is not a member' });
        }
        const expenses = await Expense.find({ groupId: req.params.groupId });
        res.status(200).json({ success: true, data: expenses });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
}

module.exports = { createExpense, getExpensesByGroup };
