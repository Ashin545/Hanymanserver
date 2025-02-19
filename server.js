require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const cors = require('cors');
const userRoutes = require('./src/routes/userRoutes');
const serviceProviderRoutes = require('./src/routes/serviceProviderRoutes');
const serviceRequestRoutes = require('./src/routes/serviceRequestRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes'); // Import feedback routes
const { errorHandler } = require('./src/middlewares/errorHandlingMiddleware');

const app = express();

app.use(cors());

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/service-providers', serviceProviderRoutes);
app.use('/api/service-requests', serviceRequestRoutes);
app.use('/api/feedback', feedbackRoutes); // Use feedback routes

// Error Handling Middleware
app.use(errorHandler);

// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
