const Booking = require('../models/Booking');
const User = require('../models/User');

// GET Request form
exports.getRequestForm = async (req, res) => {
  try {
    const worker = await User.findById(req.params.workerId);
    if (!worker || worker.role !== 'worker') {
      return res.redirect('/');
    }
    res.render('request', { worker, error: null });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
};

// POST Request submit
exports.postRequest = async (req, res) => {
  try {
    const { address, notes } = req.body;
    const worker = await User.findById(req.params.workerId);

    if (!worker || worker.role !== 'worker') {
      return res.redirect('/');
    }

    await Booking.create({
      customer: req.session.userId,
      worker: worker._id,
      skill: worker.skill,
      address,
      notes
    });

    res.redirect('/my-bookings');

  } catch (error) {
    console.error(error);
    res.render('request', { worker: null, error: 'Kuch error aa gaya' });
  }
};

// Customer: apni saari bookings dekhna
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.session.userId })
      .populate('worker')
      .sort({ createdAt: -1 });

    res.render('my-bookings', { bookings });
  } catch (error) {
    console.error(error);
    res.redirect('/dashboard');
  }
};

// Worker: apne paas aayi saari requests dekhna
exports.getWorkerRequests = async (req, res) => {
  try {
    const bookings = await Booking.find({ worker: req.session.userId })
      .populate('customer')
      .sort({ createdAt: -1 });

    res.render('worker-requests', { bookings });
  } catch (error) {
    console.error(error);
    res.redirect('/dashboard');
  }
};

// Worker: request accept karna
exports.acceptRequest = async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.bookingId, { status: 'accepted' });
    res.redirect('/worker-requests');
  } catch (error) {
    console.error(error);
    res.redirect('/worker-requests');
  }
};

// Worker: request reject karna
exports.rejectRequest = async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.bookingId, { status: 'rejected' });
    res.redirect('/worker-requests');
  } catch (error) {
    console.error(error);
    res.redirect('/worker-requests');
  }
};

// Worker: kaam complete mark karna
exports.markComplete = async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.bookingId, { status: 'completed' });
    res.redirect('/worker-requests');
  } catch (error) {
    console.error(error);
    res.redirect('/worker-requests');
  }
};

// Customer: rating submit karna
exports.submitRating = async (req, res) => {
  try {
    const { bookingId, rating, review } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking || booking.status !== 'completed') {
      return res.redirect('/my-bookings');
    }

    booking.rating = rating;
    booking.review = review;
    await booking.save();

    res.redirect('/my-bookings');

  } catch (error) {
    console.error(error);
    res.redirect('/my-bookings');
  }
};