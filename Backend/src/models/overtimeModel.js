const mongoose = require('mongoose');

const overtimeSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        attendance: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Attendance',
        },
        requestedHours: {
            type: Number,
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending',
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

const Overtime = mongoose.model('Overtime', overtimeSchema);

module.exports = Overtime;
