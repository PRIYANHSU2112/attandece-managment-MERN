const asyncHandler = require('express-async-handler');
const Attendance = require('../models/attendanceModel');
const moment = require('moment');

// @desc    Generate daily attendance report
// @route   GET /api/attendance/report/daily
// @access  Private (Manager/Admin)
const getDailyReport = asyncHandler(async (req, res) => {
    const { date } = req.query; // Expecting YYYY-MM-DD
    const searchDate = date ? moment(date, 'YYYY-MM-DD').startOf('day') : moment().startOf('day');
    const endDate = moment(searchDate).endOf('day');

    let query = {
        createdAt: {
            $gte: searchDate.toDate(),
            $lte: endDate.toDate(),
        },
    };

    // If Manager, only show their team (based on managerId in User model)
    // This assumes employees have a managerId field
    if (req.user.role === 'Manager') {
        // First find all users managed by this manager
        const User = require('../models/userModel');
        const teamUsers = await User.find({ managerId: req.user._id }).select('_id');
        const userIds = teamUsers.map(u => u._id);
        query.user = { $in: userIds };
    }

    const report = await Attendance.find(query)
        .populate('user', 'name email role')
        .sort({ createdAt: -1 });

    res.json(report);
});

module.exports = { getDailyReport };
