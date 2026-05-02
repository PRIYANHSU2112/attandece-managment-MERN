const cron = require('node-cron');
const moment = require('moment');
const User = require('../models/userModel');
const Attendance = require('../models/attendanceModel');
const { sendNotification } = require('./notificationService');

const initCronJobs = () => {
    cron.schedule('0 10 * * *', async () => {
        console.log('Running 10:00 AM Missed Punch Check...');
        
        try {
            const todayStart = moment().startOf('day').toDate();
            const todayEnd = moment().endOf('day').toDate();

            const employees = await User.find({ role: 'Employee', isActive: true });
            
            const todayAttendance = await Attendance.find({
                punchIn: { $gte: todayStart, $lte: todayEnd }
            }).select('user');

            const punchedInUserIds = todayAttendance.map(att => att.user.toString());

            const missingPunches = employees.filter(emp => !punchedInUserIds.includes(emp._id.toString()));

            for (const emp of missingPunches) {
                const title = 'Missed Punch Alert! ⏰';
                const message = `Hi ${emp.name}, you haven't clocked in for today yet. Please punch in now.`;
                await sendNotification(emp._id, title, message, 'MISSED_PUNCH');
            }

            if (missingPunches.length > 0) {
                console.log(`Dispatched ${missingPunches.length} missed punch push notifications.`);
            } else {
                console.log('No missed punches detected today.');
            }

        } catch (error) {
            console.error('Error in Missed Punch Cron Job:', error);
        }
    });

    console.log('Cron Jobs Initialized.');
};

module.exports = { initCronJobs };
