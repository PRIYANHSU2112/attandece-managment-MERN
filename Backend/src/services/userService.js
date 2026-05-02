const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const authUser = async (email, password, fcmToken) => {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        if (fcmToken) {
            user.fcmToken = fcmToken;
            await user.save();
        }
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        };
    } else {
        throw new Error('Invalid email or password');
    }
};

const registerUser = async (name, email, password, role, managerId) => {
    const userExists = await User.findOne({ email });

    if (userExists) {
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
        managerId: managerId || undefined,
    });

    if (user) {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        };
    } else {
        throw new Error('Invalid user data');
    }
};

const getUserProfile = async (id) => {
    const user = await User.findById(id).select('-password').populate('managerId', 'name email');

    if (user) {
        return user;
    } else {
        throw new Error('User not found');
    }
};

const updateUserProfile = async (id, { name, email, password }) => {
    const user = await User.findById(id);

    if (user) {
        user.name = name || user.name;
        user.email = email || user.email;

        if (password) {
            user.password = password;
        }

        const updatedUser = await user.save();
        return {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            managerId: updatedUser.managerId,
            token: generateToken(updatedUser._id),
        };
    } else {
        throw new Error('User not found');
    }
};

const getAllUsers = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        User.find({})
            .select('-password')
            .skip(skip)
            .limit(limit),
        User.countDocuments()
    ]);

    return {
        users,
        page,
        pages: Math.ceil(total / limit),
        total,
    };
};

const getAllManagers = async () => {
    const managers = await User.find({ role: 'Manager' }).select('-password');
    return managers;
};

const updateUserRole = async (id, role, managerId) => {
    const user = await User.findById(id);

    if (user) {
        user.role = role || user.role;
        user.managerId = (managerId !== undefined && managerId !== "") ? managerId : user.managerId;

        if (user.role === 'Employee' && !user.managerId) {
            throw new Error('Manager assignment is compulsory for Employees');
        }

        const updatedUser = await user.save();
        return {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            managerId: updatedUser.managerId,
        };
    } else {
        throw new Error('User not found');
    }
};

module.exports = {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    getAllManagers,
    updateUserRole,
};
