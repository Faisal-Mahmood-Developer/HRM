const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ✅ Use environment variable for JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'yourSuperSecretJWTKey123';

exports.loginUser = async (req, res) => {
    const { empId, password } = req.body;

    if (!empId || !password) {
        return res.status(400).json({ msg: 'Please enter both Employee ID and Password' });
    }

    try {
        // ✅ Find user by empId
        const user = await User.findOne({ empId });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Employee ID or Password' });
        }

        // ✅ Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Employee ID or Password' });
        }

        // ✅ Create flattened JWT payload
        const payload = {
            _id: user._id,
            empId: user.empId,
            name: user.name,
            isAdmin: user.isAdmin
        };

        // ✅ Sign JWT token
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

        // ✅ Send token + user info to frontend
        res.status(200).json({
            msg: 'Login successful',
            token,
            user: payload
        });

    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};
