const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');  

// Register a new user
router.post('/register', userController.registerUser);

// Login user
router.post('/login', userController.loginUser);

// Get all users (admin only)
router.get('/', userController.getAllUsers);

// Get a single user
router.get('/:id', userController.getUser);

module.exports = router;
