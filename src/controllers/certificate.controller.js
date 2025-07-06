const asyncHandler = require('express-async-handler');
const httpStatus = require('http-status');
const Certificate = require('../models/certificate.model');

/**
 * Get all certificates
 * @route GET /api/certificates
 * @access Public
 */
const getCertificates = asyncHandler(async (req, res) => {
  const { featured, limit = 10, page = 1, sortBy = 'order', sortOrder = 'asc' } = req.query;
  
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
  
  const certificates = await Certificate.find(query, null, options);
  const total = await Certificate.countDocuments(query);
  
  res.json({
    success: true,
    data: certificates,
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      pages: Math.ceil(total / parseInt(limit, 10)),
    },
  });
});

/**
 * Get certificate by ID
 * @route GET /api/certificates/:certificateId
 * @access Public
 */
const getCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findById(req.params.certificateId);
  
  if (!certificate) {
    res.status(httpStatus.NOT_FOUND);
    throw new Error('Certificate not found');
  }
  
  res.json({
    success: true,
    data: certificate,
  });
});

/**
 * Create a new certificate
 * @route POST /api/certificates
 * @access Private/Admin
 */
const createCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.create(req.body);
  
  res.status(httpStatus.CREATED).json({
    success: true,
    data: certificate,
  });
});

/**
 * Update certificate
 * @route PUT /api/certificates/:certificateId
 * @access Private/Admin
 */
const updateCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findById(req.params.certificateId);
  
  if (!certificate) {
    res.status(httpStatus.NOT_FOUND);
    throw new Error('Certificate not found');
  }
  
  const updatedCertificate = await Certificate.findByIdAndUpdate(
    req.params.certificateId,
    req.body,
    { new: true, runValidators: true }
  );
  
  res.json({
    success: true,
    data: updatedCertificate,
  });
});

/**
 * Delete certificate
 * @route DELETE /api/certificates/:certificateId
 * @access Private/Admin
 */
const deleteCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findById(req.params.certificateId);
  
  if (!certificate) {
    res.status(httpStatus.NOT_FOUND);
    throw new Error('Certificate not found');
  }
  
  await certificate.deleteOne();
  
  res.json({
    success: true,
    message: 'Certificate removed',
  });
});

module.exports = {
  getCertificates,
  getCertificate,
  createCertificate,
  updateCertificate,
  deleteCertificate,
}; 