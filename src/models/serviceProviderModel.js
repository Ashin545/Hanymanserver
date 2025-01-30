const mongoose = require('mongoose');

const serviceProviderSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  serviceType: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  availability: [{ type: String }],
}, {
  timestamps: true,
});

const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);
module.exports = ServiceProvider;
