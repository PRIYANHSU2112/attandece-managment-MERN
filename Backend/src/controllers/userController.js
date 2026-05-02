const asyncHandler = require('express-async-handler');
const userService = require('../services/userService');
const User = require('../models/userModel');

const authUser = asyncHandler(async (req, res) => {
    const { email, password, fcmToken } = req.body;
    const userData = await userService.authUser(email, password, fcmToken);
    res.json(userData);
});

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, managerId } = req.body;
    const userData = await userService.registerUser(name, email, password, role, managerId);
    res.status(201).json(userData);
});

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await userService.getUserProfile(req.user._id);
    res.json(user);
});

const getUserProfileById = asyncHandler(async (req, res) => {
    const user = await userService.getUserProfile(req.params.id);
    res.json(user);
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const updatedUser = await userService.updateUserProfile(req.user._id, { name, email, password });
    res.json(updatedUser);
});

const getUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const paginatedUsers = await userService.getAllUsers(page, limit);
    res.json(paginatedUsers);
});

const getManagers = asyncHandler(async (req, res) => {
    const managers = await userService.getAllManagers();
    res.json(managers);
});

const updateUserRole = asyncHandler(async (req, res) => {
    const { role, managerId } = req.body;
    const updatedUser = await userService.updateUserRole(req.params.id, role, managerId);
    res.json(updatedUser);
});

const getTeam = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        User.find({ managerId: req.user._id })
            .skip(skip)
            .limit(limit),
        User.countDocuments({ managerId: req.user._id })
    ]);

    res.json({
        users,
        page,
        pages: Math.ceil(total / limit),
        total,
    });
});

module.exports = {
    authUser,
    registerUser,
    getUserProfile,
    getUserProfileById,
    updateUserProfile,
    getUsers,
    getManagers,
    updateUserRole,
    getTeam,
};
