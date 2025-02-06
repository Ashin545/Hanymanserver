const asyncHandler = require('express-async-handler');
const ServiceProvider = require('../models/serviceProviderModel');

// Admin verification of service provider
const verifyServiceProvider = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const serviceProvider = await ServiceProvider.findById(id);

  if (!serviceProvider) {
    res.status(404);
    throw new Error('Service provider not found');
  }

  serviceProvider.isVerified = true;
  await serviceProvider.save();

  res.status(200).json({ message: 'Service provider verified successfully' });
});

module.exports = { verifyServiceProvider };
