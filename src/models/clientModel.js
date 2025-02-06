const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
}, {
  timestamps: true,
});

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;
