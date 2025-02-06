const asyncHandler = require('express-async-handler');
const ServiceRequest = require('../models/serviceRequestModel');

// Client creates a service request
const createServiceRequest = asyncHandler(async (req, res) => {
  const { serviceType, scheduledDate } = req.body;
  const clientId = req.user._id;

  const serviceRequest = new ServiceRequest({
    client: clientId,
    serviceType,
    scheduledDate,
  });

  const createdRequest = await serviceRequest.save();
  res.status(201).json(createdRequest);
});

// Service Provider accepts a service request
const acceptServiceRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const serviceProviderId = req.user._id;

  const serviceRequest = await ServiceRequest.findById(id);

  if (!serviceRequest) {
    res.status(404);
    throw new Error('Service request not found');
  }

  if (serviceRequest.status !== 'Pending') {
    res.status(400);
    throw new Error('Service request has already been accepted');
  }

  serviceRequest.status = 'Accepted';
  serviceRequest.serviceProvider = serviceProviderId;
  await serviceRequest.save();

  res.status(200).json({ message: 'Service request accepted' });
});

module.exports = { createServiceRequest, acceptServiceRequest };
