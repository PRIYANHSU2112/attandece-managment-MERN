const asyncHandler = require('express-async-handler');
const Overtime = require('../models/overtimeModel');
const Attendance = require('../models/attendanceModel');
const { sendNotification } = require('../services/notificationService');

const requestOvertime = asyncHandler(async (req, res) => {
    const { attendanceId, requestedHours, reason } = req.body;

    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
        res.status(404);
        throw new Error('Attendance record not found');
    }

    const overtime = await Overtime.create({
        user: req.user._id,
        attendance: attendanceId,
        requestedHours,
        reason,
    });

    res.status(201).json(overtime);
});

const updateOvertimeStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const overtime = await Overtime.findById(req.params.id).populate('user');

    if (!overtime) {
        res.status(404);
        throw new Error('Overtime request not found');
    }

    overtime.status = status;
    overtime.approvedBy = req.user._id;

    await overtime.save();

    const title = status === 'Approved' ? 'Overtime Approved! 🚀' : 'Overtime Request Update';
    const message = `Your overtime request for ${overtime.requestedHours} hours has been ${status.toLowerCase()}.`;
    
    await sendNotification(overtime.user._id, title, message, 'OVERTIME');

    res.json(overtime);
});

const getPendingOvertime = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const keyword = req.query.search || '';
    const statusFilter = req.query.status;

    let query = {};
    if (req.user.role === 'Manager') {
        const User = require('../models/userModel');
        const teamUsers = await User.find({ managerId: req.user._id }).select('_id');
        const userIds = teamUsers.map(u => u._id);
        query.user = { $in: userIds };
    }

    if (statusFilter && statusFilter !== 'All') {
        query.status = statusFilter;
    } else if (!statusFilter) {
        query.status = 'Pending';
    }

    if (keyword) {
        const User = require('../models/userModel');
        const users = await User.find({
         $or:[
            {name:{$regex:keyword,$options:'i'}},
            {email:{$regex:keyword,$options:'i'}}
         ]
        }).select('_id');
        const userIds = users.map(u => u._id);

        query.$or = [
            { reason: { $regex: keyword, $options: 'i' } },
            { user: { $in: userIds } }
        ];
    }

    const [overtime, total] = await Promise.all([
        Overtime.find(query)
            .populate('user', 'name email')
            .populate('attendance')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Overtime.countDocuments(query)
    ]);

    res.json({
        overtime,
        page,
        pages: Math.ceil(total / limit),
        total,
    });
});

const getAllOvertime = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const keyword = req.query.search || '';
    const statusFilter = req.query.status;

    let query = {};
    if (req.user.role === 'Manager') {
        const User = require('../models/userModel');
        const teamUsers = await User.find({ managerId: req.user._id }).select('_id');
        const userIds = teamUsers.map(u => u._id);
        query.user = { $in: userIds };
    }

    if (statusFilter && statusFilter !== 'All') {
        query.status = statusFilter;
    }

    if (keyword) {
        const User = require('../models/userModel');
        const users = await User.find({
         $or:[
            {name:{$regex:keyword,$options:'i'}},
            {email:{$regex:keyword,$options:'i'}}
         ]
        }).select('_id');
        const userIds = users.map(u => u._id);

        query.$or = [
            { reason: { $regex: keyword, $options: 'i' } },
            { user: { $in: userIds } }
        ];
    }

    const [overtime, total] = await Promise.all([
        Overtime.find(query)
            .populate('user', 'name email')
            .populate('attendance')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Overtime.countDocuments(query)
    ]);

    res.json({
        overtime,
        page,
        pages: Math.ceil(total / limit),
        total,
    });
});

const getMyOvertime = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [overtime, total] = await Promise.all([
        Overtime.find({ user: req.user._id })
            .populate('attendance')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Overtime.countDocuments({ user: req.user._id })
    ]);

    res.json({
        overtime,
        page,
        pages: Math.ceil(total / limit),
        total,
    });
});

module.exports = {
    requestOvertime,
    updateOvertimeStatus,
    getPendingOvertime,
    getAllOvertime,
    getMyOvertime,
};
