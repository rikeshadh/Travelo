const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');

// @route   GET /api/properties
// @desc    Get all properties (with search and advanced filters)
router.get('/', async (req, res) => {
  try {
    const {
      search,
      propertyType,
      priceMin,
      priceMax,
      rating,
      amenities,
      sort,
      page = 1,
      limit = 6
    } = req.query;

    const query = {};

    // Destination search
    if (search) {
      query.$or = [
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.country': { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Property Type
    if (propertyType && propertyType !== 'all') {
      query.propertyType = propertyType;
    }

    // Price Filtering
    if (priceMin || priceMax) {
      query.pricePerNight = {};
      if (priceMin) query.pricePerNight.$gte = Number(priceMin);
      if (priceMax) query.pricePerNight.$lte = Number(priceMax);
    }

    // Rating Filtering
    if (rating) {
      query['ratings.average'] = { $gte: Number(rating) };
    }

    // Amenities (all matches)
    if (amenities) {
      const amenitiesList = amenities.split(',');
      query.amenities = { $all: amenitiesList };
    }

    // Sorting
    let sortOptions = {};
    if (sort === 'price_asc') {
      sortOptions = { pricePerNight: 1 };
    } else if (sort === 'price_desc') {
      sortOptions = { pricePerNight: -1 };
    } else if (sort === 'rating') {
      sortOptions = { 'ratings.average': -1 };
    } else {
      sortOptions = { createdAt: -1 }; // Default: Newest
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      properties,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/properties/:id
// @desc    Get a single property's details
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Fetch related reviews
    const reviews = await Review.find({ propertyId: req.params.id }).sort({ createdAt: -1 });

    // Fetch similar properties
    const similar = await Property.find({
      propertyType: property.propertyType,
      _id: { $ne: property._id }
    }).limit(3);

    res.json({ property, reviews, similar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/properties/:id/reviews
// @desc    Create a review for a property
router.post('/:id/reviews', protect, async (req, res) => {
  const { rating, comment } = req.body;
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Create review
    const review = await Review.create({
      propertyId: property._id,
      userId: req.user.id,
      userName: req.user.name,
      userAvatar: req.user.avatar || '',
      rating: Number(rating),
      comment
    });

    // Recalculate ratings
    const reviews = await Review.find({ propertyId: property._id });
    const count = reviews.length;
    const average = reviews.reduce((acc, item) => item.rating + acc, 0) / count;

    property.ratings.count = count;
    property.ratings.average = Math.round(average * 10) / 10;
    await property.save();

    res.status(201).json({ review, ratings: property.ratings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
