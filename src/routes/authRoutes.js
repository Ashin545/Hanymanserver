const express = require('express');
const { registerAdmin, authAdmin, getAdminProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/signup/admin', registerAdmin); // Admin signup route
router.post('/login', authAdmin);
router.get('/profile', protect, getAdminProfile);

module.exports = router;
