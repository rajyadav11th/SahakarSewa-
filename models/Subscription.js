const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: {
    type: String,
    enum: ['free', '1month', '2month', '6month'],
    required: true
  },
  amount: { type: Number, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['active', 'expired'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);