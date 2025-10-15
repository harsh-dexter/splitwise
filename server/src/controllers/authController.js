const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(user) {
    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(400).json({ success: false, error: 'Email already in use' });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email: email.toLowerCase(), passwordHash });
        const token = signToken(user);
        return res.status(201).json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Server Error' });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        const token = signToken(user);
        return res.status(200).json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Server Error' });
    }
}

async function me(req, res) {
    try {
        const user = await User.findById(req.user.userId).select('_id name email avatarUrl');
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        return res.status(200).json({ success: true, user });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Server Error' });
    }
}

module.exports = { register, login, me };


