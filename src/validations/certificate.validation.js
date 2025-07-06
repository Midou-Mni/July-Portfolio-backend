const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCertificate = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    issuer: Joi.string().required(),
    issueDate: Joi.date().required(),
    expiryDate: Joi.date().allow(null, ''),
    credentialId: Joi.string().allow(''),
    credentialUrl: Joi.string().uri().allow(''),
    imageUrl: Joi.string().uri().allow(''),
    description: Joi.string().allow(''),
    featured: Joi.boolean(),
    order: Joi.number(),
  }),
};

const updateCertificate = {
  params: Joi.object().keys({
    certificateId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    issuer: Joi.string(),
    issueDate: Joi.date(),
    expiryDate: Joi.date().allow(null, ''),
    credentialId: Joi.string().allow(''),
    credentialUrl: Joi.string().uri().allow(''),
    imageUrl: Joi.string().uri().allow(''),
    description: Joi.string().allow(''),
    featured: Joi.boolean(),
    order: Joi.number(),
  }).min(1),
};

const getCertificate = {
  params: Joi.object().keys({
    certificateId: Joi.string().custom(objectId).required(),
  }),
};

const deleteCertificate = {
  params: Joi.object().keys({
    certificateId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createCertificate,
  updateCertificate,
  getCertificate,
  deleteCertificate,
}; 