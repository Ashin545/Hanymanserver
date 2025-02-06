const express = require('express');
const { createServiceRequest, acceptServiceRequest } = require('../controllers/serviceRequestController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// Client creates a service request
router.post('/request', protect, createServiceRequest);

// Service provider accepts a service request
router.put('/accept/:id', protect, acceptServiceRequest);

module.exports = router;
