const express = require('express');
const { registerClient, authClient, getClientProfile, requestService } = require('../controllers/clientController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/signup', registerClient);
router.post('/login', authClient);
router.get('/profile', protect, getClientProfile);
router.post('/request', protect, requestService);

module.exports = router;
