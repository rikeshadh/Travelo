const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// Helper to generate dates array between two dates
const getDatesRange = (startDateStr, endDateStr) => {
  const dates = [];
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

// @route   POST /api/bookings
// @desc    Create a new booking
router.post('/', protect, async (req, res) => {
  const {
    propertyId,
    checkInDate,
    checkOutDate,
    guests,
    totalPrice,
    guestDetails
  } = req.body;

  try {
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check availability
    const requestedDates = getDatesRange(checkInDate, checkOutDate);
    const overlap = requestedDates.some(date => property.availability.includes(date));
    if (overlap) {
      return res.status(400).json({ message: 'Property is not available for the selected dates' });
    }

    // Create booking
    const booking = await Booking.create({
      propertyId,
      userId: req.user.id,
      checkInDate,
      checkOutDate,
      guests,
      totalPrice,
      paymentStatus: 'paid', // Hardcoded paid since it's a simulated payment
      bookingStatus: 'confirmed',
      guestDetails
    });

    // Mark dates as unavailable
    property.availability.push(...requestedDates);
    await property.save();

    // Create a user notification
    await Notification.create({
      userId: req.user.id,
      message: `Your booking for "${property.title}" is confirmed from ${checkInDate} to ${checkOutDate}!`,
      link: `/dashboard`
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bookings/user
// @desc    Get current user's bookings
router.get('/user', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('propertyId')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(bookingObjId = req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Ensure authorized user
    if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.bookingStatus = 'cancelled';
    await booking.save();

    // Release dates from property availability
    const property = await Property.findById(booking.propertyId);
    if (property) {
      const bookedDates = getDatesRange(booking.checkInDate, booking.checkOutDate);
      property.availability = property.availability.filter(d => !bookedDates.includes(d));
      await property.save();
    }

    // Notify user
    await Notification.create({
      userId: booking.userId,
      message: `Booking for "${property ? property.title : 'Accommodation'}" has been cancelled.`,
      link: `/dashboard`
    });

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
