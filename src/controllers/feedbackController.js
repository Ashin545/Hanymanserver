const Feedback = require('../models/Feedback');
const ServiceRequest = require('../models/ServiceRequest');

// Submit feedback for a service request
const submitFeedback = async (req, res) => {
  try {
    const { serviceRequestId, rating, comment } = req.body;

    // Find the service request
    const serviceRequest = await ServiceRequest.findById(serviceRequestId);
    if (!serviceRequest || serviceRequest.client.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Service request not found or unauthorized' });
    }

    // Ensure the service request is completed
    if (serviceRequest.status !== 'completed') {
      return res.status(400).json({ message: 'Service request must be completed to leave feedback' });
    }

    // Create new feedback
    const newFeedback = new Feedback({
      client: req.user.id,
      serviceRequest: serviceRequestId,
      rating,
      comment,
    });

    // Save the feedback
    await newFeedback.save();

    // Link feedback to the service request
    serviceRequest.feedback = newFeedback._id;
    await serviceRequest.save();

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: newFeedback,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get feedback for a service request
const getFeedback = async (req, res) => {
  try {
    const serviceRequestId = req.params.id;

    // Find the service request and populate feedback
    const serviceRequest = await ServiceRequest.findById(serviceRequestId).populate('feedback');
    if (!serviceRequest) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    res.status(200).json({
      feedback: serviceRequest.feedback || 'No feedback yet',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  submitFeedback,
  getFeedback
};
