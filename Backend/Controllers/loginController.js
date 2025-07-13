const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.loginUser = async (req, res) => {
    const { empId, password } = req.body;

    if (!empId || !password) {
        return res.status(400).json({ msg: 'Please enter both Employee ID and Password' });
    }

    try {
        const user = await User.findOne({ empId });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Employee ID or Password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Employee ID or Password' });
        }

        res.status(200).json({
            msg: 'Login successful',
            user: {
                _id: user._id,
                empId: user.empId,
                name: user.name,
                isAdmin: user.isAdmin      // ✅ Include isAdmin for role-based protection
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

