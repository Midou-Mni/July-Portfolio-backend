const express = require('express');
const { validate } = require('../middleware/validate.middleware');
const reviewValidation = require('../validations/review.validation');
const reviewController = require('../controllers/review.controller');
const { protect, admin, reviewRateLimiter } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @route GET /api/reviews
 * @desc Get reviews by project
 * @access Public
 */
router.get('/', validate(reviewValidation.getReviews), reviewController.getReviews);

/**
 * @route POST /api/reviews
 * @desc Create a new review
 * @access Public (with rate limiting)
 */
router.post(
  '/',
  reviewRateLimiter,
  validate(reviewValidation.createReview),
  reviewController.createReview
);

/**
 * @route DELETE /api/reviews/:reviewId
 * @desc Delete review
 * @access Private/Admin
 */
router.delete('/:reviewId', protect, admin, reviewController.deleteReview);

module.exports = router; 