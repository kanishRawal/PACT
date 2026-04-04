const mongoose = require('mongoose');

const agreementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    partyAName: { type: String, required: true },
    partyAEmail: { type: String, required: true },
    partyBName: { type: String, required: true },
    partyBEmail: { type: String, required: true },
    amount: { type: Number },
    agreementType: { type: String, required: true, enum: ['General', 'Service', 'Asset', 'Personal', 'Other'] },
    dueDate: { type: Date, required: true },
    location: { type: String },
    status: { 
        type: String, 
        enum: ['Pending Verification', 'Partially Verified', 'Verified', 'Completed', 'Disputed', 'Cancelled'], 
        default: 'Pending Verification' 
    },
    partyAVerified: { type: Boolean, default: false },
    partyBVerified: { type: Boolean, default: false },
    partyAVerifiedAt: { type: Date },
    partyBVerifiedAt: { type: Date },
    cihHash: { type: String },
    deviceFingerprint: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Agreement', agreementSchema);
