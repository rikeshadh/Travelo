const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/auth');

// Apply protection & admin filter to all admin routes
router.use(protect, adminOnly);

// @route   GET /api/admin/analytics
// @desc    Retrieve system dashboard analytics (revenue, metrics, charts data)
router.get('/analytics', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // Calculate revenue
    const paidBookings = await Booking.find({ paymentStatus: 'paid', bookingStatus: { $ne: 'cancelled' } });
    const totalRevenue = paidBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    // Get analytics for property types
    const propertyTypeCounts = await Property.aggregate([
      { $group: { _id: '$propertyType', count: { $sum: 1 } } }
    ]);

    // Monthly bookings breakout (simplified simulation based on created bookings)
    const bookingsByMonth = [
      { name: 'Jan', revenue: totalRevenue * 0.12, bookings: Math.ceil(totalBookings * 0.1) },
      { name: 'Feb', revenue: totalRevenue * 0.10, bookings: Math.ceil(totalBookings * 0.08) },
      { name: 'Mar', revenue: totalRevenue * 0.15, bookings: Math.ceil(totalBookings * 0.12) },
      { name: 'Apr', revenue: totalRevenue * 0.18, bookings: Math.ceil(totalBookings * 0.15) },
      { name: 'May', revenue: totalRevenue * 0.22, bookings: Math.ceil(totalBookings * 0.25) },
      { name: 'Jun', revenue: totalRevenue * 0.23, bookings: Math.ceil(totalBookings * 0.3) }
    ];

    res.json({
      metrics: {
        totalUsers,
        totalProperties,
        totalBookings,
        totalRevenue
      },
      propertyTypes: propertyTypeCounts.map(item => ({ name: item._id, value: item.count })),
      bookingsByMonth
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all registered users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update a user's system role
router.put('/users/:id/role', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.role = req.body.role;
    await user.save();
    res.json({ message: 'Role updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/bookings
// @desc    Get all reservations
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('propertyId', 'title location pricePerNight')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/admin/properties
// @desc    Add a new listing
router.post('/properties', async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/admin/properties/:id
// @desc    Update property listing details
router.put('/properties/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/admin/properties/:id
// @desc    Remove property listing
router.delete('/properties/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
