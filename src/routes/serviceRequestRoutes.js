// routes/serviceRequestRoutes.js
const express = require('express');
const router = express.Router();
const serviceRequestController = require('../controllers/serviceRequestController');
const { protect } = require('../middlewares/authMiddleware');

// Create a new service request (clients only)
router.post('/create', protect, serviceRequestController.createServiceRequest);

// Get all service requests (for admin or client)
router.get('/', serviceRequestController.getServiceRequests);

// Get a single service request by ID
router.get('/:id', serviceRequestController.getServiceRequest);

// Update the status of a service request
router.put('/:id/status', serviceRequestController.updateServiceRequestStatus);

module.exports = router;
