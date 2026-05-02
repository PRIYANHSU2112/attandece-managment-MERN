const express = require('express');
const router = express.Router();
const {
    punchIn,
    punchOut,
    getMyAttendance,
    validateAttendance,
    getTodayAttendance,
    getTeamAttendance,
    getAllAttendance,
    exportAttendanceReport,
} = require('../controllers/attendanceController');
const reportController = require('../controllers/reportController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../config/multer');

router
    .route('/')
    .post(protect, punchIn);

router.route('/punch-out').put(protect, punchOut);
router.route('/my').get(protect, getMyAttendance);
router.route('/today').get(protect, getTodayAttendance);
router.route('/team').get(protect, authorize('Manager'), getTeamAttendance);
router.route('/all').get(protect, authorize('Admin'), getAllAttendance);
router.route('/export').get(protect, authorize('Manager', 'Admin'), exportAttendanceReport);

router
    .route('/report/daily')
    .get(protect, authorize('Manager', 'Admin'), reportController.getDailyReport);

router
    .route('/:id/validate')
    .put(protect, authorize('Manager', 'Admin'), validateAttendance);

module.exports = router;
