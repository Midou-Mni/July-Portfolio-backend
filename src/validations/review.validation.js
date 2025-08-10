const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReview = {
  body: Joi.object().keys({
    project: Joi.string().custom(objectId).required(),
    name: Joi.string().allow(''),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required(),
    contact: Joi.object().keys({
      email: Joi.string().email().allow(''),
      whatsapp: Joi.string().pattern(/^\+?[\d\s\-\(\)]{10,}$/).allow(''),
      instagram: Joi.string().pattern(/^[a-zA-Z0-9._]{1,30}$/).allow(''),
      facebook: Joi.string().pattern(/^[a-zA-Z0-9.]{5,50}$/).allow(''),
    }).allow({}),
  }),
};

const getReviews = {
  query: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createReview,
  getReviews,
}; 