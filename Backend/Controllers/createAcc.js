const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');

// ✅ POST /api/account/create-account
const CreateAcc = async (req, res) => {
    const { empId, password, name } = req.body;

    if (!empId || !password || !name) {
        return res.status(400).json({ msg: 'All fields are required' });
    }

    try {
        const existing = await User.findOne({ empId });
        if (existing) {
            return res.status(400).json({ msg: 'Account already exists for this Employee ID' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ empId, name, password: hashedPassword });
        await user.save();

        res.status(201).json({ msg: '✅ Account created successfully' });
    } catch (err) {
        console.error('❌ CreateAcc Error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// ✅ GET /api/account/users
const GetAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); // exclude passwords
        res.status(200).json(users);
    } catch (err) {
        console.error('❌ GetAllUsers Error:', err);
        res.status(500).json({ msg: 'Failed to fetch users' });
    }
};

// ✅ PUT /api/account/change-password/:id
const ChangePassword = async (req, res) => {
    try {
        const userId = req.params.id;
        const newPassword = req.body.password;

        console.log('🔧 Received userId:', userId);
        console.log('🔧 Received newPassword:', newPassword);

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ msg: 'Invalid user ID format' });
        }

        if (!newPassword) {
            return res.status(400).json({ msg: 'Password is required' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.status(200).json({ msg: '✅ Password updated successfully' });
    } catch (err) {
        console.error('❌ ChangePassword Error:', err);
        res.status(500).json({ msg: '❌ Server error while updating password' });
    }
};

module.exports = {
    CreateAcc,
    GetAllUsers,
    ChangePassword
};
