const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const ServiceRequest = require('../models/serviceRequestModel');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Client Signup
const registerClient = asyncHandler(async (req, res) => {
  const { name, email, password, address } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    address,
    role: 'client',
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// Client Login
const authClient = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (user.role === 'client') {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Not authorized as a client');
    }
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// Client Profile
const getClientProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
    });
  } else {
    res.status(404);
    throw new Error('Client not found');
  }
});

// Request Service
const requestService = asyncHandler(async (req, res) => {
  const { serviceType, scheduledDate } = req.body;
  const serviceRequest = new ServiceRequest({
    client: req.user._id,
    serviceType,
    scheduledDate,
  });

  const createdRequest = await serviceRequest.save();
  res.status(201).json(createdRequest);
});

module.exports = { registerClient, authClient, getClientProfile, requestService };
