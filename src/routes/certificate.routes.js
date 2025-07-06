const express = require('express');
const { validate } = require('../middleware/validate.middleware');
const certificateValidation = require('../validations/certificate.validation');
const certificateController = require('../controllers/certificate.controller');
const { protect, admin } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @route GET /api/certificates
 * @desc Get all certificates
 * @access Public
 */
router.get('/', certificateController.getCertificates);

/**
 * @route GET /api/certificates/:certificateId
 * @desc Get certificate by ID
 * @access Public
 */
router.get(
  '/:certificateId', 
  validate(certificateValidation.getCertificate), 
  certificateController.getCertificate
);

/**
 * @route POST /api/certificates
 * @desc Create a new certificate
 * @access Private/Admin
 */
router.post(
  '/',
  protect,
  admin,
  validate(certificateValidation.createCertificate),
  certificateController.createCertificate
);

/**
 * @route PUT /api/certificates/:certificateId
 * @desc Update certificate
 * @access Private/Admin
 */
router.put(
  '/:certificateId',
  protect,
  admin,
  validate(certificateValidation.updateCertificate),
  certificateController.updateCertificate
);

/**
 * @route DELETE /api/certificates/:certificateId
 * @desc Delete certificate
 * @access Private/Admin
 */
router.delete(
  '/:certificateId',
  protect,
  admin,
  validate(certificateValidation.deleteCertificate),
  certificateController.deleteCertificate
);

module.exports = router; 