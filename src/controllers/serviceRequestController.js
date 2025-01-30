const asyncHandler = require('express-async-handler');
const ServiceRequest = require('../models/serviceRequestModel');

const getServiceRequests = asyncHandler(async (req, res) => {
  const serviceRequests = await ServiceRequest.find({}).populate('client serviceProvider');
  res.status(200).json(serviceRequests);
});

module.exports = { getServiceRequests };
