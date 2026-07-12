require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');
const chatRoutes = require('./routes/chat');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors({ origin: '*' })); // Allow any frontend client address
app.use(express.json());

// API Route Registrations
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

// Simple Welcome Check
app.get('/', (req, res) => {
  res.send('Travelo REST API Server is running...');
});

// Custom Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Something broke on the server!',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in mode on port ${PORT}`);
});
