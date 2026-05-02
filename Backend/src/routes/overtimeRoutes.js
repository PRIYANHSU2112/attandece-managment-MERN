const express = require('express');
const router = express.Router();
const {
    requestOvertime,
    updateOvertimeStatus,
    getPendingOvertime,
    getAllOvertime,
    getMyOvertime,
} = require('../controllers/overtimeController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/').post(protect, requestOvertime);
router.route('/my').get(protect, getMyOvertime);
router.route('/pending').get(protect, authorize('Manager', 'Admin'), getPendingOvertime);
router.route('/all').get(protect, authorize('Manager', 'Admin'), getAllOvertime);
router.route('/:id').put(protect, authorize('Manager', 'Admin'), updateOvertimeStatus);

module.exports = router;
