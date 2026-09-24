const User = require('../models/User');
const Booking = require('../models/Booking');
const Subscription = require('../models/Subscription');

exports.getWorkersBySkill = async (req, res) => {
  try {
    const { skill } = req.params;
    const { lat, lng, radius, area } = req.query;

    let workers;
    const searchRadius = radius ? parseInt(radius) : 50;

    if (area && area.trim() !== '') {
      workers = await User.find({
        role: 'worker',
        skill: skill,
        'location.address': { $regex: area, $options: 'i' }
      }).lean();

    } else if (lat && lng) {
      workers = await User.find({
        role: 'worker',
        skill: skill,
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: searchRadius * 1000
          }
        }
      }).lean();

    } else {
      workers = await User.find({ role: 'worker', skill: skill }).lean();
    }

    // Sirf active-subscription AND KYC-approved workers rakho
     const filteredWorkers = [];
     for (let w of workers) {
     const sub = await Subscription.findOne({ worker: w._id }).sort({ endDate: -1 });
     const hasActiveSub = sub && new Date(sub.endDate) > new Date();
     const isKycApproved = w.kycStatus === 'approved';

  if (hasActiveSub && isKycApproved) {
    filteredWorkers.push(w);
  }
}
workers = filteredWorkers;

    // Har worker ki average rating nikal lo
    for (let w of workers) {
      const ratedBookings = await Booking.find({ worker: w._id, rating: { $exists: true } });
      if (ratedBookings.length > 0) {
        const total = ratedBookings.reduce((sum, b) => sum + b.rating, 0);
        w.avgRating = (total / ratedBookings.length).toFixed(1);
        w.ratingCount = ratedBookings.length;
      } else {
        w.avgRating = null;
        w.ratingCount = 0;
      }
    }

    res.render('workers', { workers, skill, lat, lng, radius: searchRadius, area: area || '' });

  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
};

exports.getWorkerProfile = async (req, res) => {
  try {
    const worker = await User.findById(req.params.workerId);

    if (!worker || worker.role !== 'worker') {
      return res.redirect('/');
    }

    const ratedBookings = await Booking.find({
      worker: worker._id,
      rating: { $exists: true }
    }).populate('customer').sort({ createdAt: -1 });

    let avgRating = null;
    if (ratedBookings.length > 0) {
      const total = ratedBookings.reduce((sum, b) => sum + b.rating, 0);
      avgRating = (total / ratedBookings.length).toFixed(1);
    }

    res.render('worker-profile', {
      worker,
      reviews: ratedBookings,
      avgRating,
      ratingCount: ratedBookings.length
    });

  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
};