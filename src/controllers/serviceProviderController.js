const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ServiceProvider = require('../models/ServiceProvider');
const User = require('../models/User');

// Service provider self-registration
const registerServiceProvider = async (req, res) => {
  try {
    const { name, phone, servicesOffered, availability, email, password } = req.body;

    // Ensure that the user does not already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user (service provider) with role "serviceProvider"
    const newUser = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10), // Hash password
      phone,
      role: 'serviceProvider',
    });

    await newUser.save();

    // Create a new service provider entry
    const newServiceProvider = new ServiceProvider({
      user: newUser._id,
      name: name || newUser.name,               // Use `name` from `User` or override it
      phone: phone || newUser.phone,             // Use `phone` from `User` or override it
      servicesOffered,                           // Services offered by the provider
      availability,                              // Availability of the provider
      verified: false,                           // Set the provider to unverified initially
    });

    await newServiceProvider.save();

    res.status(201).json({
      message: 'Service provider registered successfully. Awaiting admin approval.',
      serviceProvider: newServiceProvider,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Service provider login
const loginServiceProvider = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the service provider user by email
    const user = await User.findOne({ email });
    if (!user || user.role !== 'serviceProvider') {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if the service provider is approved (verified)
    const serviceProvider = await ServiceProvider.findOne({ user: user._id });
    if (!serviceProvider || !serviceProvider.verified) {
      return res.status(403).json({ message: 'Your account is pending approval by an admin' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: serviceProvider.name,  // Name fetched from ServiceProvider model
        email: user.email,
        phone: serviceProvider.phone, // Phone fetched from ServiceProvider model
        role: user.role,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin approves a service provider by their ID
const approveServiceProvider = async (req, res) => {
  try {
    const { serviceProviderId } = req.params;

    // Find the service provider by ID
    const serviceProvider = await ServiceProvider.findById(serviceProviderId);
    if (!serviceProvider) {
      return res.status(404).json({ message: 'Service provider not found' });
    }

    // Check if the provider is already verified
    if (serviceProvider.verified) {
      return res.status(400).json({ message: 'Service provider is already approved' });
    }

    // Update the service provider's verified status to true
    serviceProvider.verified = true;
    await serviceProvider.save();

    res.status(200).json({
      message: 'Service provider approved successfully',
      serviceProvider,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerServiceProvider,
  loginServiceProvider,
  approveServiceProvider,
};
