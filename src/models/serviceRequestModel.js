const mongoose = require('mongoose');

const serviceRequestSchema = mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  serviceProvider: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider' },
  serviceType: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  scheduledDate: { type: Date, required: true },
  rating: { type: Number },
  feedback: { type: String },
}, {
  timestamps: true,
});

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);
module.exports = ServiceRequest;
