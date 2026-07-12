const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  propertyType: { type: String, enum: ['hotel', 'apartment', 'villa', 'cabin', 'resort'], required: true },
  pricePerNight: { type: Number, required: true },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 }
  },
  imageGallery: [{ type: String }],
  amenities: [{ type: String }],
  ratings: {
    average: { type: Number, default: 4.5 },
    count: { type: Number, default: 0 }
  },
  host: {
    name: { type: String, required: true },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    email: { type: String, default: '' }
  },
  availability: [{ type: String }], // Array of unavailable date strings (YYYY-MM-DD)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', propertySchema);
