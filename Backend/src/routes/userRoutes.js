const express = require('express');
const router = express.Router();
const {
    authUser,
    registerUser,
    getUserProfile,
    getUserProfileById,
    updateUserProfile,
    getUsers,
    getManagers,
    updateUserRole,
    getTeam,
} = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/').post(registerUser).get(protect, authorize('Admin'), getUsers);
router.post('/login', authUser);
router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);
router.route('/profile/:id').get(protect, authorize('Admin'), getUserProfileById);
router.route('/managers').get(protect, getManagers);
router.route('/team').get(protect, authorize('Manager'), getTeam);
router.route('/:id').put(protect, authorize('Admin'), updateUserRole);

module.exports = router;
