const asyncHandler = require('express-async-handler');
const httpStatus = require('http-status');
const Project = require('../models/project.model');
const Review = require('../models/review.model');

/**
 * Get all projects
 * @route GET /api/projects
 * @access Public
 */
const getProjects = asyncHandler(async (req, res) => {
  const { featured, limit = 10, page = 1, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  
  const query = {};
  if (featured === 'true') {
    query.featured = true;
  }
  
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  
  const options = {
    sort,
    limit: parseInt(limit, 10),
    skip: (parseInt(page, 10) - 1) * parseInt(limit, 10),
  };
  
  const projects = await Project.find(query, null, options);
  const total = await Project.countDocuments(query);
  
  res.json({
    success: true,
    data: projects,
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      pages: Math.ceil(total / parseInt(limit, 10)),
    },
  });
});

/**
 * Get project by ID
 * @route GET /api/projects/:projectId
 * @access Public
 */
const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  
  if (!project) {
    res.status(httpStatus.NOT_FOUND);
    throw new Error('Project not found');
  }
  
  // Get average rating
  const averageRating = await project.getAverageRating();
  
  // Get reviews count
  const reviewsCount = await Review.countDocuments({ project: project._id });
  
  res.json({
    success: true,
    data: {
      ...project.toJSON(),
      averageRating,
      reviewsCount,
    },
  });
});

/**
 * Create a new project
 * @route POST /api/projects
 * @access Private/Admin
 */
const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create(req.body);
  
  res.status(httpStatus.CREATED).json({
    success: true,
    data: project,
  });
});

/**
 * Update project
 * @route PUT /api/projects/:projectId
 * @access Private/Admin
 */
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  
  if (!project) {
    res.status(httpStatus.NOT_FOUND);
    throw new Error('Project not found');
  }
  
  const updatedProject = await Project.findByIdAndUpdate(
    req.params.projectId,
    req.body,
    { new: true, runValidators: true }
  );
  
  res.json({
    success: true,
    data: updatedProject,
  });
});

/**
 * Delete project
 * @route DELETE /api/projects/:projectId
 * @access Private/Admin
 */
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  
  if (!project) {
    res.status(httpStatus.NOT_FOUND);
    throw new Error('Project not found');
  }
  
  // Delete all reviews associated with this project
  await Review.deleteMany({ project: req.params.projectId });
  
  // Delete the project
  await project.deleteOne();
  
  res.json({
    success: true,
    message: 'Project removed',
  });
});

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
}; 