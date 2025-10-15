const Group = require('../models/Group');
const Expense = require('../models/Expense');
const { computeBalances } = require('../utils/calculationUtils');

async function getSummary(req, res) {
    try {
        const User = require('../models/User'); // Add User model import
        const me = await User.findById(req.user.userId).select('name email');
        const identifier = me?.name || me?.email;
        const group = await Group.findOne({ _id: req.params.groupId, members: identifier });
        if (!group) {
            return res.status(404).json({ success: false, error: 'Group not found or user is not a member' });
        }
        const expenses = await Expense.find({ groupId: req.params.groupId });
        const balances = computeBalances(expenses, group.members);
        res.status(200).json({ success: true, balances });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
}

module.exports = { getSummary };
