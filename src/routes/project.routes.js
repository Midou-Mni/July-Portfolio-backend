const express = require('express');
const { validate } = require('../middleware/validate.middleware');
const projectValidation = require('../validations/project.validation');
const projectController = require('../controllers/project.controller');
const { protect, admin } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

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
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'additionalImages', maxCount: 10 }
  ]),
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
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'additionalImages', maxCount: 10 }
  ]),
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

/**
 * @route POST /api/projects/:projectId/images
 * @desc Add additional images to a project
 * @access Private/Admin
 */
router.post(
  '/:projectId/images',
  protect,
  admin,
  upload.fields([
    { name: 'additionalImages', maxCount: 10 }
  ]),
  validate(projectValidation.addProjectImages),
  projectController.addProjectImages
);

/**
 * @route DELETE /api/projects/:projectId/images/:imageIndex
 * @desc Remove an image from a project
 * @access Private/Admin
 */
router.delete(
  '/:projectId/images/:imageIndex',
  protect,
  admin,
  validate(projectValidation.removeProjectImage),
  projectController.removeProjectImage
);

/**
 * @route PUT /api/projects/:projectId/images/reorder
 * @desc Reorder project images
 * @access Private/Admin
 */
router.put(
  '/:projectId/images/reorder',
  protect,
  admin,
  validate(projectValidation.reorderProjectImages),
  projectController.reorderProjectImages
);

module.exports = router; 