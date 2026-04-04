const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'pact_super_secret_for_demo';

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Authorization token missing or invalid' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        
        req.user = decoded; // { userId, email, name, iat, exp }
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token', errors: [error.message] });
    }
};

module.exports = authMiddleware;
