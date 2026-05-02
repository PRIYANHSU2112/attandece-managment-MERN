const asyncHandler = require('express-async-handler');
const Attendance = require('../models/attendanceModel');
const Overtime = require('../models/overtimeModel');
const User = require('../models/userModel');
const Company = require('../models/companyModel');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const { calculateDistance } = require('../utils/geoHelper');

const punchIn = asyncHandler(async (req, res) => {
    const { latitude, longitude, selfie } = req.body;

    if (!selfie) {
        res.status(400);
        throw new Error('Please provide a selfie');
    }

    if (!latitude || !longitude) {
        res.status(400);
        throw new Error('Location coordinates are required');
    }

    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().endOf('day').toDate();

    const existingAttendance = await Attendance.findOne({
        user: req.user._id,
        punchIn: { $gte: startOfDay, $lte: endOfDay }
    });

    if (existingAttendance) {
        res.status(400);
        throw new Error('You have already punched in for today. Only one punch-in allowed per 24 hours.');
    }

    let company = await Company.findOne();
    if (!company) {
        company = await Company.create({
            name: 'Company HQ',
            latitude: 18.5204,
            longitude: 73.8567,
            radius: 500
        });
    }

    const { latitude: OFFICE_LAT, longitude: OFFICE_LON, radius: MAX_RADIUS } = company;

    const distance = calculateDistance(
        parseFloat(OFFICE_LAT),
        parseFloat(OFFICE_LON),
        parseFloat(latitude),
        parseFloat(longitude)
    );

    if (distance > MAX_RADIUS) {
        res.status(403);
        throw new Error(`Punch-in denied: You are ${Math.round(distance)} meters away from the office. Maximum allowed radius is ${MAX_RADIUS} meters.`);
    }

    let imageBuffer;
    let extension = 'png';
    const matches = selfie.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
        imageBuffer = Buffer.from(matches[2], 'base64');
        extension = matches[1].split('/')[1] || 'png';
    } else {
        imageBuffer = Buffer.from(selfie, 'base64');
    }

    const filename = `selfie-${Date.now()}.${extension}`;
    const uploadDir = path.join('uploads', 'selfies');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, imageBuffer);

    const attendance = await Attendance.create({
        user: req.user._id,
        punchIn: new Date(),
        selfieUrl: filepath.replace(/\\/g, '/'),
        location: {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
        },
    });

    res.status(201).json(attendance);
});

const punchOut = asyncHandler(async (req, res) => {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        res.status(400);
        throw new Error('Location coordinates are required for punch out');
    }

    let company = await Company.findOne();
    if (!company) {
        company = await Company.create({
            name: 'Company HQ',
            latitude: 18.5204,
            longitude: 73.8567,
            radius: 500
        });
    }

    const { latitude: OFFICE_LAT, longitude: OFFICE_LON, radius: MAX_RADIUS } = company;

    const distance = calculateDistance(
        parseFloat(OFFICE_LAT),
        parseFloat(OFFICE_LON),
        parseFloat(latitude),
        parseFloat(longitude)
    );

    if (distance > MAX_RADIUS) {
        res.status(403);
        throw new Error(`Punch-out denied: You are ${Math.round(distance)} meters away from the office. Maximum allowed radius is ${MAX_RADIUS} meters.`);
    }

    const attendance = await Attendance.findOne({
        user: req.user._id,
        punchOut: { $exists: false },
    }).sort({ createdAt: -1 });

    if (!attendance) {
        res.status(400);
        throw new Error('No active punch-in found');
    }

    attendance.punchOut = new Date();

    const duration = moment.duration(moment(attendance.punchOut).diff(moment(attendance.punchIn)));
    const hours = duration.asHours();
    attendance.workingHours = hours;

    attendance.status = hours >= 8 ? 'Completed' : 'Incomplete';

    await attendance.save();

    res.json(attendance);
});

const getMyAttendance = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [attendance, total] = await Promise.all([
        Attendance.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Attendance.countDocuments({ user: req.user._id })
    ]);

    res.json({
        attendance,
        page,
        pages: Math.ceil(total / limit),
        total,
    });
});

const validateAttendance = asyncHandler(async (req, res) => {
    const { validationStatus, remarks } = req.body;
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
        res.status(404);
        throw new Error('Attendance record not found');
    }

    attendance.validationStatus = validationStatus;
    attendance.remarks = remarks;

    await attendance.save();

    res.json(attendance);
});

const getTodayAttendance = asyncHandler(async (req, res) => {
    const today = moment().startOf('day');
    const tomorrow = moment(today).add(1, 'days');

    const attendance = await Attendance.find({
        user: req.user._id,
        punchIn: { $gte: today.toDate(), $lt: tomorrow.toDate() },
    });

    res.json(attendance);
});

const getTeamAttendance = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const teamUsers = await User.find({ managerId: req.user._id }).select('_id');
    const userIds = teamUsers.map(u => u._id);

    const query = { user: { $in: userIds } };

    if (req.query.date) {
        const startOfDay = moment(req.query.date, 'YYYY-MM-DD').startOf('day').toDate();
        const endOfDay = moment(req.query.date, 'YYYY-MM-DD').endOf('day').toDate();
        query.punchIn = { $gte: startOfDay, $lte: endOfDay };
    }

    const [attendance, total] = await Promise.all([
        Attendance.find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Attendance.countDocuments(query)
    ]);

    res.json({
        attendance,
        page,
        pages: Math.ceil(total / limit),
        total,
    });
});

const getAllAttendance = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.date) {
        const startOfDay = moment(req.query.date, 'YYYY-MM-DD').startOf('day').toDate();
        const endOfDay = moment(req.query.date, 'YYYY-MM-DD').endOf('day').toDate();
        query.punchIn = { $gte: startOfDay, $lte: endOfDay };
    }

    const [attendance, total] = await Promise.all([
        Attendance.find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Attendance.countDocuments(query)
    ]);

    res.json({
        attendance,
        page,
        pages: Math.ceil(total / limit),
        total,
    });
});

const exportAttendanceReport = asyncHandler(async (req, res) => {
    const { startDate, endDate, teamOnly } = req.query;

    let query = {};
    
    if (startDate && endDate) {
        query.punchIn = {
            $gte: moment(startDate).startOf('day').toDate(),
            $lte: moment(endDate).endOf('day').toDate()
        };
    }

    if (req.user.role === 'Manager' || teamOnly === 'true') {
        const teamUsers = await User.find({ managerId: req.user._id }).select('_id');
        const userIds = teamUsers.map(u => u._id);
        query.user = { $in: userIds };
    }

    const attendanceRecords = await Attendance.find(query)
        .populate('user', 'name email')
        .sort({ punchIn: -1 });

    const attendanceIds = attendanceRecords.map(r => r._id);
    const overtimeRecords = await Overtime.find({ attendance: { $in: attendanceIds } });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance Report');

    worksheet.columns = [
        { header: 'Employee Name', key: 'name', width: 25 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Punch In', key: 'punchIn', width: 15 },
        { header: 'Punch Out', key: 'punchOut', width: 15 },
        { header: 'Hours', key: 'hours', width: 10 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'OT Requested', key: 'otRequested', width: 15 },
        { header: 'OT Status', key: 'otStatus', width: 15 },
        { header: 'OT Reason', key: 'otReason', width: 30 },
    ];

    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4F46E5' } 
    };

    attendanceRecords.forEach(record => {
        const relatedOT = overtimeRecords.find(ot => ot.attendance.toString() === record._id.toString());
        
        worksheet.addRow({
            name: record.user?.name || 'N/A',
            email: record.user?.email || 'N/A',
            date: moment(record.punchIn).format('YYYY-MM-DD'),
            punchIn: moment(record.punchIn).format('hh:mm A'),
            punchOut: record.punchOut ? moment(record.punchOut).format('hh:mm A') : 'N/A',
            hours: record.workingHours ? record.workingHours.toFixed(2) : '0.00',
            status: record.status,
            otRequested: relatedOT ? `${relatedOT.requestedHours}h` : 'None',
            otStatus: relatedOT ? relatedOT.status : 'N/A',
            otReason: relatedOT ? relatedOT.reason : 'N/A',
        });
    });

    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + `Report_${moment().format('YYYY-MM-DD')}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
});

module.exports = {
    punchIn,
    punchOut,
    getMyAttendance,
    validateAttendance,
    getTodayAttendance,
    getTeamAttendance,
    getAllAttendance,
    exportAttendanceReport,
};
