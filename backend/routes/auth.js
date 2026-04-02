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
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        name = name.trim();
        email = email.trim().toLowerCase();
        
        const nameRegex = /^[a-zA-Z\s'\-]+$/;
        if (!nameRegex.test(name)) {
            return res.status(400).json({ error: 'Name contains invalid characters' });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'Email already in use' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ userId: user._id, email, name }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user: { name, email, _id: user._id } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        email = email.trim().toLowerCase();

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id, email, name: user.name }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { name: user.name, email, _id: user._id } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
