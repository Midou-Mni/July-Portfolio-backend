const asyncHandler = require('express-async-handler');
const httpStatus = require('http-status');
const Review = require('../models/review.model');
const Project = require('../models/project.model');

/**
 * Create a new review
 * @route POST /api/reviews
 * @access Public
 */
const createReview = asyncHandler(async (req, res) => {
  const { project: projectId, rating, comment, name } = req.body;

  // Check if project exists
  const project = await Project.findById(projectId);
  if (!project) {
    res.status(httpStatus.NOT_FOUND);
    throw new Error('Project not found');
  }

  // Get client IP address
  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // Check if user has already reviewed this project from this IP
  const existingReview = await Review.findOne({ project: projectId, ipAddress });
  if (existingReview) {
    res.status(httpStatus.BAD_REQUEST);
    throw new Error('You have already reviewed this project');
  }

  // Create review
  const review = await Review.create({
    project: projectId,
    rating,
    comment,
    name: name || 'Anonymous',
    ipAddress,
  });

  res.status(httpStatus.CREATED).json({
    success: true,
    data: review,
  });
});

/**
 * Get reviews by project
 * @route GET /api/reviews
 * @access Public
 */
const getReviews = asyncHandler(async (req, res) => {
  const { projectId, limit = 10, page = 1, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

  // Check if project exists
  const project = await Project.findById(projectId);
  if (!project) {
    res.status(httpStatus.NOT_FOUND);
    throw new Error('Project not found');
  }

  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const options = {
    sort,
    limit: parseInt(limit, 10),
    skip: (parseInt(page, 10) - 1) * parseInt(limit, 10),
  };

  const reviews = await Review.find({ project: projectId }, null, options);
  const total = await Review.countDocuments({ project: projectId });

  res.json({
    success: true,
    data: reviews,
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      pages: Math.ceil(total / parseInt(limit, 10)),
    },
  });
});

/**
 * Delete review (admin only)
 * @route DELETE /api/reviews/:reviewId
 * @access Private/Admin
 */
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review) {
    res.status(httpStatus.NOT_FOUND);
    throw new Error('Review not found');
  }

  await review.deleteOne();

  res.json({
    success: true,
    message: 'Review removed',
  });
});

module.exports = {
  createReview,
  getReviews,
  deleteReview,
}; 