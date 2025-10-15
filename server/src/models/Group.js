const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    members: { type: [String], required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    inviteCode: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Group', GroupSchema);


