const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { protect } = require('../middlewares/authMiddleware');

// Submit feedback for a service request
router.post('/submit', protect, feedbackController.submitFeedback);

// Get feedback for a service request
router.get('/:id', feedbackController.getFeedback);

module.exports = router;
