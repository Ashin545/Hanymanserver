const asyncHandler = require('express-async-handler');
const Admin = require('../models/adminModel');
const ServiceProvider = require('../models/serviceProviderModel');

const verifyServiceProvider = asyncHandler(async (req, res) => {
  const serviceProvider = await ServiceProvider.findById(req.params.id);
  if (serviceProvider) {
    serviceProvider.isVerified = true;
    await serviceProvider.save();
    res.status(200).json({ message: 'Service Provider verified' });
  } else {
    res.status(404).json({ message: 'Service Provider not found' });
  }
});

module.exports = { verifyServiceProvider };
