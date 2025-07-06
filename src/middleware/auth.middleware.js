const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const httpStatus = require('http-status');

/**
 * Middleware to protect routes - verifies JWT token
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      res.status(httpStatus.UNAUTHORIZED);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(httpStatus.UNAUTHORIZED);
    throw new Error('Not authorized, no token');
  }
});

/**
 * Middleware to check if user is admin
 */
const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(httpStatus.FORBIDDEN);
    throw new Error('Not authorized as admin');
  }
});

/**
 * Rate limiter middleware for reviews
 */
const rateLimit = require('express-rate-limit');

const reviewRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 review submissions per hour
  message: 'Too many reviews submitted, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  protect,
  admin,
  reviewRateLimiter
}; 