const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const { notFound, errorHandler } = require('./src/middlewares/errorMiddleware'); //import errorhandler
const adminRoutes = require('./src/routes/adminRoutes');// Import admin routes
const clientRoutes = require('./src/routes/clientRoutes'); // Import client routes
const serviceProviderRoutes = require('./src/routes/serviceProviderRoutes'); // Import Service routes
const serviceRequestRoutes = require('./src/routes/serviceRequestRoutes'); // Import Service Request routes
const authRoutes = require('./src/routes/authRoutes'); // Import authroutes

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use('/api/admin', adminRoutes);// admin Routes
app.use('/api/client', clientRoutes); //client routes
app.use('/api/serviceProvider', serviceProviderRoutes); //ServiceProviderRoutes
app.use('/api/serviceRequest', serviceRequestRoutes); //ServiceRequestRoutes
app.use('/api/auth', authRoutes); //the auth routes

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
