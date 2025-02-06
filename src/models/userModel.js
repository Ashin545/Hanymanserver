const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User schema
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'client', 'serviceProvider'], required: true },
}, {
  timestamps: true,
});

// Password matching method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Middleware to move the user to respective collections based on role
userSchema.post('save', async function(doc) {
  try {
    if (doc.role === 'serviceProvider') {
      const ServiceProvider = mongoose.model('ServiceProvider');
      const serviceProvider = new ServiceProvider({
        _id: doc._id,
        name: doc.name,
        email: doc.email,
        serviceType: doc.serviceType,
        isVerified: false,
        availability: [],
      });
      await serviceProvider.save();
    }

    if (doc.role === 'client') {
      const Client = mongoose.model('Client');
      const client = new Client({
        _id: doc._id,
        name: doc.name,
        email: doc.email,
        address: doc.address,
      });
      await client.save();
    }

    if (doc.role === 'admin') {
      const Admin = mongoose.model('Admin');
      const admin = new Admin({
        _id: doc._id,
        name: doc.name,
        email: doc.email,
      });
      await admin.save();
    }
  } catch (error) {
    console.error('Error moving user to the appropriate collection:', error);
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
