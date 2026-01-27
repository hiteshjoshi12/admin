const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      // CRITICAL FIX: Check if user actually exists
      // (User might have been deleted from DB after token was issued)
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      // ADDED RETURN: Stop execution immediately
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // If no header or doesn't start with Bearer
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    // Changed to direct JSON response for consistency with 'protect'
    // throwing an Error here can sometimes be messy depending on your global error handler
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };