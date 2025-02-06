const express = require('express');
const { verifyServiceProvider } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.put('/verify/:id', protect, verifyServiceProvider);

module.exports = router;
