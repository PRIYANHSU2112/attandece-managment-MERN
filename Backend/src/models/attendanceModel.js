const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        punchIn: {
            type: Date,
            required: true,
        },
        punchOut: {
            type: Date,
        },
        selfieUrl: {
            type: String,
            required: true,
        },
        location: {
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true },
        },
        workingHours: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['Incomplete', 'Completed'],
            default: 'Incomplete',
        },
        validationStatus: {
            type: String,
            enum: ['Pending', 'Valid', 'Invalid'],
            default: 'Pending',
        },
        remarks: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
