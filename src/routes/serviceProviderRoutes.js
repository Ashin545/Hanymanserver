const express = require('express');
const { registerServiceProvider, authServiceProvider, getServiceProviderProfile, acceptServiceRequest } = require('../controllers/serviceProviderController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/signup', registerServiceProvider);
router.post('/login', authServiceProvider);
router.get('/profile', protect, getServiceProviderProfile);
router.put('/accept/:id', protect, acceptServiceRequest); 
module.exports = router;
