const Joi = require('joi');

const createProject = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    technologies: Joi.array().items(Joi.string()).required(),
    category: Joi.string(),
    imageUrl: Joi.string().uri().allow(''),
    liveUrl: Joi.string().uri().allow(''),
    githubUrl: Joi.string().uri().allow(''),
    featured: Joi.boolean(),
    order: Joi.number(),
  }),
};

const updateProject = {
  params: Joi.object().keys({
    projectId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    technologies: Joi.array().items(Joi.string()),
    category: Joi.string(),
    imageUrl: Joi.string().uri().allow(''),
    liveUrl: Joi.string().uri().allow(''),
    githubUrl: Joi.string().uri().allow(''),
    featured: Joi.boolean(),
    order: Joi.number(),
  }).min(1),
};

const getProject = {
  params: Joi.object().keys({
    projectId: Joi.string().required(),
  }),
};

const deleteProject = {
  params: Joi.object().keys({
    projectId: Joi.string().required(),
  }),
};

module.exports = {
  createProject,
  updateProject,
  getProject,
  deleteProject,
}; 