const Group = require('../models/Group');
const Expense = require('../models/Expense');
const crypto = require('crypto');
const User = require('../models/User');

async function getGroups(req, res) {
    try {
        const me = await User.findById(req.user.userId).select('name email');
        const identifier = me?.name || me?.email;
        const groups = await Group.find({
            $or: [
                { ownerId: req.user.userId },
                { members: identifier },
            ],
        });

        // For each group, fetch its expenses
        const groupsWithExpenses = await Promise.all(groups.map(async (group) => {
            const expenses = await Expense.find({ groupId: group._id });
            return { ...group.toObject(), expenses };
        }));

        res.status(200).json({ success: true, data: groupsWithExpenses });
    } catch (err) {
        console.error('Error in getGroups:', err); // Add logging for debugging
        res.status(500).json({ success: false, error: 'Server Error' });
    }
}

async function createGroup(req, res) {
    try {
        const { name, members } = req.body;
        const me = await User.findById(req.user.userId).select('name email');
        const identifier = me?.name || me?.email;
        const initialMembers = identifier && !members.includes(identifier) ? [identifier, ...members] : members;
        const group = await Group.create({ name, members: initialMembers, ownerId: req.user.userId });
        res.status(201).json({ success: true, data: group });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}

async function getGroupById(req, res) {
    try {
        const me = await User.findById(req.user.userId).select('name email');
        const identifier = me?.name || me?.email; // Define identifier here
        const group = await Group.findOne({
            _id: req.params.id,
            $or: [
                { ownerId: req.user.userId },
                { members: identifier }, // Check if the user's name/email is in the members array
            ],
        });
        if (!group) {
            return res.status(404).json({ success: false, error: 'Group not found or user is not a member' });
        }
        const expenses = await Expense.find({ groupId: req.params.id });
        res.status(200).json({ success: true, data: { ...group.toObject(), expenses } });
    } catch (err) {
        console.error('Error in getGroupById:', err); // Log the error for debugging
        res.status(500).json({ success: false, error: 'Server Error' });
    }
}

async function updateGroup(req, res) {
    try {
        const { id } = req.params;
        const { name, members } = req.body;
        const me = await User.findById(req.user.userId).select('name email');
        const identifier = me?.name || me?.email;

        const update = {};
        if (typeof name === 'string' && name.trim().length > 0) update.name = name.trim();
        if (Array.isArray(members) && members.length > 0) {
            // Ensure the owner's identifier is always included in the members list if they are not already
            const updatedMembers = identifier && !members.includes(identifier) ? [identifier, ...members] : members;
            update.members = updatedMembers;
        }

        // Allow update only if the user is the owner or a member of the group
        const group = await Group.findOneAndUpdate(
            {
                _id: id,
                $or: [
                    { ownerId: req.user.userId },
                    { members: identifier }
                ]
            },
            update,
            { new: true }
        );
        if (!group) {
            return res.status(404).json({ success: false, error: 'Group not found or user is not a member' });
        }

        const expenses = await Expense.find({ groupId: id });
        return res.status(200).json({ success: true, data: { ...group.toObject(), expenses } });
    } catch (err) {
        return res.status(400).json({ success: false, error: err.message });
    }
}

async function generateInvite(req, res) {
    try {
        const { id } = req.params;
        let group = await Group.findOne({ _id: id, ownerId: req.user.userId });
        if (!group) {
            // Backfill: if group exists without ownerId, allow current user to claim ownership
            const legacy = await Group.findById(id);
            if (!legacy) return res.status(404).json({ success: false, error: 'Group not found' });
            if (!legacy.ownerId) {
                legacy.ownerId = req.user.userId;
                await legacy.save();
                group = legacy;
            } else {
                return res.status(403).json({ success: false, error: 'Forbidden' });
            }
        }
        const code = (crypto.randomBytes(6).toString('base64url')).slice(0, 8);
        group.inviteCode = code;
        await group.save();
        const inviteLink = `${process.env.APP_BASE_URL || 'http://localhost:3000'}/join/${code}`;
        return res.status(200).json({ success: true, inviteCode: code, inviteLink });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Server Error' });
    }
}

async function getGroupByInvite(req, res) {
    try {
        const { code } = req.params;
        const group = await Group.findOne({ inviteCode: code }).select('_id name');
        if (!group) return res.status(404).json({ success: false, error: 'Invalid code' });
        return res.status(200).json({ success: true, group });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Server Error' });
    }
}

async function joinGroupByInvite(req, res) {
    try {
        const { code } = req.params;
        const group = await Group.findOne({ inviteCode: code });
        if (!group) return res.status(404).json({ success: false, error: 'Invalid code' });
        const authUser = await User.findById(req.user.userId).select('name email');
        if (!authUser) return res.status(401).json({ success: false, error: 'Unauthorized' });
        const identifier = authUser.name || authUser.email;
        if (identifier && !group.members.includes(identifier)) {
            group.members.push(identifier);
            await group.save();
        }
        return res.status(200).json({ success: true, group: { _id: group._id, name: group.name } });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Server Error' });
    }
}

module.exports = { getGroups, createGroup, getGroupById, updateGroup, generateInvite, getGroupByInvite, joinGroupByInvite };
