const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const adminRoutes = require('./src/routes/adminRoutes');
const clientRoutes = require('./src/routes/clientRoutes');
const serviceProviderRoutes = require('./src/routes/serviceProviderRoutes');
const serviceRequestRoutes = require('./src/routes/serviceRequestRoutes');
const authRoutes = require('./src/routes/authRoutes');
const { notFound, errorHandler } = require('./src/middlewares/errorMiddleware');

dotenv.config();
connectDB();  // Connect to the database

const app = express();
app.use(express.json());  // Middleware to parse JSON bodies

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/serviceProvider', serviceProviderRoutes);
app.use('/api/serviceRequest', serviceRequestRoutes);
app.use('/api/auth', authRoutes);

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

// Server running
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
