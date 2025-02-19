const mongoose = require('mongoose');

const serviceProviderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true,
  },
  name: {               // Optional name in the ServiceProvider model
    type: String,
    required: false,  // Not required, can inherit from User
  },
  phone: {              // Optional phone number in the ServiceProvider model
    type: String,
    required: false,  // Not required, can inherit from User
  },
  servicesOffered: {
    type: [String],  // Array of services the provider offers (e.g., ["Plumbing", "Electrical"])
    required: true,
  },
  availability: {
    type: [String],  // Array of availability times (e.g., ["Mon-Fri", "9 AM - 5 PM"])
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,  // Default to unverified
  },
  role: {  // New role field to track user role as service-provider
    type: String,
    default: 'service-provider',  // Default role for ServiceProvider
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);
module.exports = ServiceProvider;
