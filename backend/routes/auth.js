const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'pact_super_secret_for_demo';

router.post('/register', async (req, res) => {
    try {
        let { name, email, password } = req.body;

        // Backend Validation
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required', errors: null });
        }
        
        name = name.trim();
        email = email.trim().toLowerCase();
        
        if (name.length < 2) {
            return res.status(400).json({ success: false, message: 'Name must be at least 2 characters long', errors: null });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email format', errors: null });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters', errors: null });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use', errors: null });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ userId: user._id, email, name }, JWT_SECRET, { expiresIn: '1d' });
        
        res.status(201).json({ 
            success: true, 
            message: 'User registered successfully', 
            data: { token, user: { name, email, _id: user._id } } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error during registration', errors: [error.message] });
    }
});

router.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required', errors: null });
        }
        
        email = email.trim().toLowerCase();

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials', errors: null });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ success: false, message: 'Invalid credentials', errors: null });
        }

        const token = jwt.sign({ userId: user._id, email, name: user.name }, JWT_SECRET, { expiresIn: '1d' });
        
        res.json({ 
            success: true, 
            message: 'Login successful', 
            data: { token, user: { name: user.name, email, _id: user._id } } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error during login', errors: [error.message] });
    }
});

module.exports = router;
