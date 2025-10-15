const Group = require('../models/Group');
const Expense = require('../models/Expense');

async function getGroups(req, res) {
    try {
        const groups = await Group.find();
        res.status(200).json({ success: true, data: groups });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
}

async function createGroup(req, res) {
    try {
        const { name, members } = req.body;
        const group = await Group.create({ name, members });
        res.status(201).json({ success: true, data: group });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}

async function getGroupById(req, res) {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ success: false, error: 'Group not found' });
        }
        const expenses = await Expense.find({ groupId: req.params.id });
        res.status(200).json({ success: true, data: { ...group.toObject(), expenses } });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
}

async function updateGroup(req, res) {
    try {
        const { id } = req.params;
        const { name, members } = req.body;

        const update = {};
        if (typeof name === 'string' && name.trim().length > 0) update.name = name.trim();
        if (Array.isArray(members) && members.length > 0) update.members = members;

        const group = await Group.findByIdAndUpdate(id, update, { new: true });
        if (!group) {
            return res.status(404).json({ success: false, error: 'Group not found' });
        }

        const expenses = await Expense.find({ groupId: id });
        return res.status(200).json({ success: true, data: { ...group.toObject(), expenses } });
    } catch (err) {
        return res.status(400).json({ success: false, error: err.message });
    }
}

module.exports = { getGroups, createGroup, getGroupById, updateGroup };


