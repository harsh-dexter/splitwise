const Group = require('../models/Group');
const Expense = require('../models/Expense');
const { computeBalances } = require('../utils/calculationUtils');

async function getSummary(req, res) {
    try {
        const group = await Group.findById(req.params.groupId);
        if (!group) {
            return res.status(404).json({ success: false, error: 'Group not found' });
        }
        const expenses = await Expense.find({ groupId: req.params.groupId });
        const balances = computeBalances(expenses, group.members);
        res.status(200).json({ success: true, balances });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
}

module.exports = { getSummary };


