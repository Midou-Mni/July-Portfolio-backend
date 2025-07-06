const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReview = {
  body: Joi.object().keys({
    project: Joi.string().custom(objectId).required(),
    name: Joi.string().allow(''),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required(),
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