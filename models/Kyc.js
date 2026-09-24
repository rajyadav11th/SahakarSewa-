const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

  profession: { type: String, required: true },
  experience: { type: Number, required: true },
  minimumFee: { type: Number, required: true },

  address: {
    houseNumber: { type: String },
    street: { type: String },
    city: { type: String, required: true },
    district: { type: String },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },

  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },

  profileImage: { type: String, required: true },
  aadharCard: { type: String, required: true },
  certificates: [{ type: String }],

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: { type: String }

}, { timestamps: true });

module.exports = mongoose.model('Kyc', kycSchema);