const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skill: { type: String, required: true },
  address: { type: String, required: true },
  notes: { type: String },
  status: {
  type: String,
  enum: ['pending', 'accepted', 'rejected', 'confirmed', 'paid', 'completed'],
  default: 'pending'
},
  paymentMethod: {
    type: String,
    enum: ['online', 'cod'],
    default: null
  },
  amount: { type: Number, default: 100 },
  rating: { type: Number, min: 1, max: 5 },
  review: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);