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

// Service Provider Signup
const registerServiceProvider = asyncHandler(async (req, res) => {
  const { name, email, password, serviceType } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    serviceType,
    role: 'serviceProvider',
    isVerified: false,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      serviceType: user.serviceType,
      isVerified: user.isVerified,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// Service Provider Login
const authServiceProvider = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (user.role === 'serviceProvider') {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        serviceType: user.serviceType,
        isVerified: user.isVerified,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Not authorized as a service provider');
    }
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// Service Provider Profile
const getServiceProviderProfile = asyncHandler(async (req, res) => {
  if (req.user.role !== 'serviceProvider') {
    res.status(401);
    throw new Error('Not authorized as a service provider');
  }

  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      serviceType: user.serviceType,
      isVerified: user.isVerified,
    });
  } else {
    res.status(404);
    throw new Error('Service provider not found');
  }
});

// Accept Service Request
const acceptServiceRequest = asyncHandler(async (req, res) => {
  const serviceRequest = await ServiceRequest.findById(req.params.id);
  if (serviceRequest) {
    serviceRequest.serviceProvider = req.user._id;
    serviceRequest.status = 'Accepted';
    await serviceRequest.save();
    res.status(200).json({ message: 'Service Request accepted' });
  } else {
    res.status(404);
    throw new Error('Service Request not found');
  }
});

module.exports = { registerServiceProvider, authServiceProvider, getServiceProviderProfile, acceptServiceRequest };
