const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProject = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    technologies: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    category: Joi.string(),
    imageUrl: Joi.string().uri().allow(''),
    additionalImages: Joi.array().items(Joi.string().uri()),
    liveUrl: Joi.string().uri().allow(''),
    githubUrl: Joi.string().uri().allow(''),
    featured: Joi.alternatives().try(
      Joi.boolean(),
      Joi.string().valid('true', 'false')
    ),
    order: Joi.alternatives().try(
      Joi.number(),
      Joi.string().pattern(/^\d+$/)
    ),
  }).unknown(true), // Allow unknown fields for multipart/form-data
};

const updateProject = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    technologies: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    category: Joi.string(),
    imageUrl: Joi.string().uri().allow(''),
    additionalImages: Joi.array().items(Joi.string().uri()),
    removeImages: Joi.string().allow(''), // Comma-separated list of image URLs to remove
    replaceAllImages: Joi.string().valid('true', 'false'),
    liveUrl: Joi.string().uri().allow(''),
    githubUrl: Joi.string().uri().allow(''),
    featured: Joi.alternatives().try(
      Joi.boolean(),
      Joi.string().valid('true', 'false')
    ),
    order: Joi.alternatives().try(
      Joi.number(),
      Joi.string().pattern(/^\d+$/)
    ),
  }).min(1).unknown(true), // Allow unknown fields for multipart/form-data
};

const getProject = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
  }),
};

const deleteProject = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
  }),
};

const addProjectImages = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
  }),
  // No body validation needed as we're only checking for files
};

const removeProjectImage = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
    imageIndex: Joi.number().integer().min(0).required(),
  }),
};

const reorderProjectImages = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    imageOrder: Joi.array().items(Joi.number().integer().min(0)).required(),
  }),
};

module.exports = {
  createProject,
  updateProject,
  getProject,
  deleteProject,
  addProjectImages,
  removeProjectImage,
  reorderProjectImages,
}; 