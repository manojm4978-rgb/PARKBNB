// controllers/authController.js
const User = require('../models/user');
// ADD THESE LINES BACK
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    // Check what data you're receiving
    console.log('Register request body received:', req.body);
    const { username, email, password, userType } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        user = new User({ username, email, password, userType });
        await user.save(); // The pre-save middleware will run here
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.loginUser = async (req, res) => {
    // Check what data you're receiving for login
    console.log('Login request body received:', req.body);
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        
        // Log the passwords before comparison
        console.log('Password from login request:', password);
        console.log('Hashed password from database:', user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Is password a match?', isMatch);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const payload = { user: { id: user.id, userType: user.userType } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, userType: user.userType });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};