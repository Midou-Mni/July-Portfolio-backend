const Joi = require('joi');
const httpStatus = require('http-status');

/**
 * Middleware for validating request data
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Validation error',
      errors: errorMessage,
    });
  }
  
  // Replace request with validated data
  Object.assign(req, value);
  return next();
};

/**
 * Helper function to pick specified properties from an object
 * @param {Object} object - Source object
 * @param {string[]} keys - Keys to pick
 * @returns {Object} Object with picked properties
 */
const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

module.exports = { validate, pick }; 