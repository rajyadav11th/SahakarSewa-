const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['customer', 'worker'], default: 'customer' },
  password: { type: String, required: true },

  // ===== Worker-only fields =====
  skill: {
    type: String,
    enum: ['electrician', 'plumber', 'carpenter', 'cleaner', 'painter', 'gardener'],
    required: function () { return this.role === 'worker'; }
  },
  kycStatus: {
  type: String,
  enum: ['not_submitted', 'pending', 'approved', 'rejected'],
  default: 'not_submitted'
},
  experience: {
    type: Number,
    required: function () { return this.role === 'worker'; }
  },
  photo: {
  type: String,
  default: null
},
  location: {
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    default: [0, 0]
  },
  address: {
    type: String // Human-readable address, jaise "Andheri, Mumbai"
  }
},
  hourlyRate: {
    type: Number,
    required: function () { return this.role === 'worker'; }
  },
  bio: {
    type: String
  }

}, { timestamps: true });

userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);