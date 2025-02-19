const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');


// Create a new service request
const createServiceRequest = async (req, res) => {
    try {
      const { serviceType, description, serviceDate, price } = req.body;
  
      // Ensure the logged-in user is a client
      const client = await User.findById(req.user.id);
      if (!client || client.role !== 'client') {
        return res.status(403).json({ message: 'Only clients can create service requests' });
      }
  
      // Create a new service request
      const newServiceRequest = new ServiceRequest({
        client: req.user.id,
        serviceType,
        description,
        serviceDate,
        price,
      });
  
      // Save the service request to the database
      await newServiceRequest.save();
      res.status(201).json({
        message: 'Service request created successfully',
        serviceRequest: newServiceRequest,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

// Get all service requests (for admin or client)
const getServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .populate('client')
      .populate('serviceProvider');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single service request by ID
const getServiceRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate('client')
      .populate('serviceProvider');
    if (!request) {
      return res.status(404).json({ message: 'Service request not found' });
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update the status of a service request (e.g., accept)
const updateServiceRequestStatus = async (req, res) => {
  try {
    const { status, serviceProviderId } = req.body;

    // Ensure the logged-in user is a service provider
    const serviceProvider = await User.findById(req.user.id);
    if (!serviceProvider || serviceProvider.role !== 'serviceProvider') {
      return res.status(403).json({ message: 'Only service providers can accept service requests' });
    }

    // Find the service request by ID
    const serviceRequest = await ServiceRequest.findById(req.params.id);
    if (!serviceRequest) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    // If the status is "accepted", assign the service provider and update status
    if (status === 'accepted') {
      // Check if the request is already accepted
      if (serviceRequest.status === 'accepted') {
        return res.status(400).json({ message: 'Service request is already accepted' });
      }

      serviceRequest.status = 'accepted';
      serviceRequest.serviceProvider = serviceProviderId; // Set the service provider who accepted
    } else if (status === 'cancelled') {
      serviceRequest.status = 'cancelled';
    }

    // Save the updated service request
    await serviceRequest.save();
    res.status(200).json({
      message: `Service request ${status} successfully`,
      serviceRequest,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createServiceRequest,
  getServiceRequests,
  getServiceRequest,
  updateServiceRequestStatus,
};
