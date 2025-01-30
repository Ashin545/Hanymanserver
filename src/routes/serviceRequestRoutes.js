const express = require('express');
const { getServiceRequests } = require('../controllers/serviceRequestController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getServiceRequests);

module.exports = router;
