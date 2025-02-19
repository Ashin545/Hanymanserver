const express = require('express');
const router = express.Router();
const serviceProviderController = require('../controllers/serviceProviderController');
const { protect } = require('../middlewares/authMiddleware');

// Service provider self-registration
router.post('/register', serviceProviderController.registerServiceProvider);

// Service provider login
router.post('/login', serviceProviderController.loginServiceProvider);

// Admin approves a service provider
router.put('/approve/:serviceProviderId', protect, serviceProviderController.approveServiceProvider);

module.exports = router;
