const mongoose = require('mongoose');

const supportMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  message: { type: String, required: true },
  sender: { type: String, enum: ['user', 'admin'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SupportMessage', supportMessageSchema);
