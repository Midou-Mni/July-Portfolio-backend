const express = require('express');
const { validate } = require('../middleware/validate.middleware');
const projectValidation = require('../validations/project.validation');
const projectController = require('../controllers/project.controller');
const { protect, admin } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @route GET /api/projects
 * @desc Get all projects
 * @access Public
 */
router.get('/', projectController.getProjects);

/**
 * @route GET /api/projects/:projectId
 * @desc Get project by ID
 * @access Public
 */
router.get('/:projectId', validate(projectValidation.getProject), projectController.getProject);

/**
 * @route POST /api/projects
 * @desc Create a new project
 * @access Private/Admin
 */
router.post(
  '/',
  protect,
  admin,
  validate(projectValidation.createProject),
  projectController.createProject
);

/**
 * @route PUT /api/projects/:projectId
 * @desc Update project
 * @access Private/Admin
 */
router.put(
  '/:projectId',
  protect,
  admin,
  validate(projectValidation.updateProject),
  projectController.updateProject
);

/**
 * @route DELETE /api/projects/:projectId
 * @desc Delete project
 * @access Private/Admin
 */
router.delete(
  '/:projectId',
  protect,
  admin,
  validate(projectValidation.deleteProject),
  projectController.deleteProject
);

module.exports = router; 