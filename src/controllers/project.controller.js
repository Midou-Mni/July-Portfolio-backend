const asyncHandler = require('express-async-handler');
const httpStatus = require('http-status');
const path = require('path');
const fs = require('fs');
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
  
  // Get all images
  const allImages = project.getAllImages();
  
  res.json({
    success: true,
    data: {
      ...project.toJSON(),
      averageRating,
      reviewsCount,
      allImages,
    },
  });
});

/**
 * Create a new project
 * @route POST /api/projects
 * @access Private/Admin
 */
const createProject = asyncHandler(async (req, res) => {
  // Handle main image file upload
  if (req.files && req.files.image) {
    // If file was uploaded, set imageUrl to the file path
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    req.body.imageUrl = `${baseUrl}/uploads/${req.files.image[0].filename}`;
  } else if (req.file) {
    // Backward compatibility for single file upload
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    req.body.imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
  }
  
  // Handle additional images upload
  if (req.files && req.files.additionalImages) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    req.body.additionalImages = req.files.additionalImages.map(
      file => `${baseUrl}/uploads/${file.filename}`
    );
  }
  
  // Convert technologies from form data format to array if needed
  if (typeof req.body.technologies === 'string') {
    req.body.technologies = req.body.technologies.split(',').map(tech => tech.trim());
  } else if (req.body.technologies && !Array.isArray(req.body.technologies)) {
    // Handle form-data array format
    const techArray = [];
    const keys = Object.keys(req.body).filter(key => key.startsWith('technologies['));
    keys.forEach(key => {
      techArray.push(req.body[key]);
    });
    req.body.technologies = techArray;
    
    // Clean up the individual technology entries
    keys.forEach(key => {
      delete req.body[key];
    });
  }
  
  // Convert boolean fields
  if (req.body.featured === 'true') req.body.featured = true;
  if (req.body.featured === 'false') req.body.featured = false;
  
  // Convert numeric fields
  if (req.body.order) req.body.order = Number(req.body.order);
  
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
  
  // Handle main image file upload
  if (req.files && req.files.image) {
    // If a new file was uploaded, delete the old one if it exists
    if (project.imageUrl && project.imageUrl.includes('/uploads/')) {
      const oldFilePath = project.imageUrl.split('/uploads/')[1];
      const fullPath = path.join(__dirname, '../../uploads', oldFilePath);
      
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
    
    // Set the new image URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    req.body.imageUrl = `${baseUrl}/uploads/${req.files.image[0].filename}`;
  } else if (req.file) {
    // Backward compatibility for single file upload
    // If a new file was uploaded, delete the old one if it exists
    if (project.imageUrl && project.imageUrl.includes('/uploads/')) {
      const oldFilePath = project.imageUrl.split('/uploads/')[1];
      const fullPath = path.join(__dirname, '../../uploads', oldFilePath);
      
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
    
    // Set the new image URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    req.body.imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
  }
  
  // Handle additional images upload
  if (req.files && req.files.additionalImages) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const newAdditionalImages = req.files.additionalImages.map(
      file => `${baseUrl}/uploads/${file.filename}`
    );
    
    // If we're replacing all additional images, delete the old ones
    if (req.body.replaceAllImages === 'true' && project.additionalImages && project.additionalImages.length > 0) {
      project.additionalImages.forEach(imageUrl => {
        if (imageUrl && imageUrl.includes('/uploads/')) {
          const oldFilePath = imageUrl.split('/uploads/')[1];
          const fullPath = path.join(__dirname, '../../uploads', oldFilePath);
          
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }
      });
      req.body.additionalImages = newAdditionalImages;
    } else {
      // Otherwise, append the new images to the existing ones
      req.body.additionalImages = [
        ...(project.additionalImages || []),
        ...newAdditionalImages
      ];
    }
  }
  
  // Handle removing specific additional images
  if (req.body.removeImages && typeof req.body.removeImages === 'string') {
    const imagesToRemove = req.body.removeImages.split(',');
    
    // Delete the image files
    imagesToRemove.forEach(imageUrl => {
      if (imageUrl && imageUrl.includes('/uploads/')) {
        const oldFilePath = imageUrl.split('/uploads/')[1];
        const fullPath = path.join(__dirname, '../../uploads', oldFilePath);
        
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
    });
    
    // Remove the images from the database
    if (project.additionalImages && project.additionalImages.length > 0) {
      req.body.additionalImages = project.additionalImages.filter(
        imageUrl => !imagesToRemove.includes(imageUrl)
      );
    }
    
    // Remove the removeImages field from the request body
    delete req.body.removeImages;
  }
  
  // Convert technologies from form data format to array if needed
  if (typeof req.body.technologies === 'string') {
    req.body.technologies = req.body.technologies.split(',').map(tech => tech.trim());
  } else if (req.body.technologies && !Array.isArray(req.body.technologies)) {
    // Handle form-data array format
    const techArray = [];
    const keys = Object.keys(req.body).filter(key => key.startsWith('technologies['));
    keys.forEach(key => {
      techArray.push(req.body[key]);
    });
    req.body.technologies = techArray;
    
    // Clean up the individual technology entries
    keys.forEach(key => {
      delete req.body[key];
    });
  }
  
  // Convert boolean fields
  if (req.body.featured === 'true') req.body.featured = true;
  if (req.body.featured === 'false') req.body.featured = false;
  
  // Convert numeric fields
  if (req.body.order) req.body.order = Number(req.body.order);
  
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
  
  // Delete the project main image file if it exists
  if (project.imageUrl && project.imageUrl.includes('/uploads/')) {
    const filePath = project.imageUrl.split('/uploads/')[1];
    const fullPath = path.join(__dirname, '../../uploads', filePath);
    
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
  
  // Delete all additional image files if they exist
  if (project.additionalImages && project.additionalImages.length > 0) {
    project.additionalImages.forEach(imageUrl => {
      if (imageUrl && imageUrl.includes('/uploads/')) {
        const filePath = imageUrl.split('/uploads/')[1];
        const fullPath = path.join(__dirname, '../../uploads', filePath);
        
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
    });
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

/**
 * Add additional images to project
 * @route POST /api/projects/:projectId/images
 * @access Private/Admin
 */
const addProjectImages = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  
  if (!project) {
    res.status(httpStatus.NOT_FOUND);
    throw new Error('Project not found');
  }
  
  if (!req.files || !req.files.additionalImages) {
    res.status(httpStatus.BAD_REQUEST);
    throw new Error('No images uploaded');
  }
  
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const newImages = req.files.additionalImages.map(
    file => `${baseUrl}/uploads/${file.filename}`
  );
  
  // Add new images to the project
  project.additionalImages = [
    ...(project.additionalImages || []),
    ...newImages
  ];
  
  await project.save();
  
  res.status(httpStatus.OK).json({
    success: true,
    data: project,
  });
});

/**
 * Remove an image from project
 * @route DELETE /api/projects/:projectId/images/:imageIndex
 * @access Private/Admin
 */
const removeProjectImage = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  
  if (!project) {
    res.status(httpStatus.NOT_FOUND);
    throw new Error('Project not found');
  }
  
  const imageIndex = parseInt(req.params.imageIndex, 10);
  
  if (isNaN(imageIndex) || imageIndex < 0 || !project.additionalImages || imageIndex >= project.additionalImages.length) {
    res.status(httpStatus.BAD_REQUEST);
    throw new Error('Invalid image index');
  }
  
  // Get the image URL to delete
  const imageUrl = project.additionalImages[imageIndex];
  
  // Delete the file from the filesystem
  if (imageUrl && imageUrl.includes('/uploads/')) {
    const filePath = imageUrl.split('/uploads/')[1];
    const fullPath = path.join(__dirname, '../../uploads', filePath);
    
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
  
  // Remove the image from the array
  project.additionalImages.splice(imageIndex, 1);
  await project.save();
  
  res.status(httpStatus.OK).json({
    success: true,
    data: project,
  });
});

/**
 * Reorder project images
 * @route PUT /api/projects/:projectId/images/reorder
 * @access Private/Admin
 */
const reorderProjectImages = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  
  if (!project) {
    res.status(httpStatus.NOT_FOUND);
    throw new Error('Project not found');
  }
  
  const { imageOrder } = req.body;
  
  if (!imageOrder || !Array.isArray(imageOrder) || imageOrder.length === 0) {
    res.status(httpStatus.BAD_REQUEST);
    throw new Error('Image order array is required');
  }
  
  if (!project.additionalImages || project.additionalImages.length === 0) {
    res.status(httpStatus.BAD_REQUEST);
    throw new Error('Project has no additional images to reorder');
  }
  
  // Validate that all indices in imageOrder are valid
  const validIndices = imageOrder.every(index => 
    Number.isInteger(index) && 
    index >= 0 && 
    index < project.additionalImages.length
  );
  
  if (!validIndices) {
    res.status(httpStatus.BAD_REQUEST);
    throw new Error('Invalid image indices in order array');
  }
  
  // Create a new array with the images in the specified order
  const reorderedImages = imageOrder.map(index => project.additionalImages[index]);
  
  // Update the project with the reordered images
  project.additionalImages = reorderedImages;
  await project.save();
  
  res.status(httpStatus.OK).json({
    success: true,
    data: project,
  });
});

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addProjectImages,
  removeProjectImage,
  reorderProjectImages,
}; 