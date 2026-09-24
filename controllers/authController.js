const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Middleware: check karo login hai ya nahi
exports.isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/signin');
  }
};

// Worker ke liye: KYC approved hone tak dashboard/booking-related pages block karo
exports.requireApprovedKyc = async (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/signin');
  }

  const User = require('../models/User');
  const user = await User.findById(req.session.userId);

  // Customer ke liye ye check lagu nahi hota
  if (user.role === 'customer') {
    return next();
  }

  // Worker hai — KYC status check karo
  if (user.kycStatus === 'approved') {
    return next();
  }

  // Approved nahi hai — KYC page pe bhej do
  return res.redirect('/kyc');
};

// GET Signup page
exports.getSignup = (req, res) => {
  res.render('signup', { error: null });
};

// POST Signup (form submit)
exports.postSignup = async (req, res) => {
  try {
    const { name, email, phone, role, password, skill, experience, address, latitude, longitude, hourlyRate, bio } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('signup', { error: 'Email already registered hai' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = { name, email, phone, role, password: hashedPassword };

    if (role === 'worker') {
      userData.skill = skill;
      userData.experience = experience;
      userData.hourlyRate = hourlyRate;
      userData.bio = bio;

      userData.location = {
        type: 'Point',
        coordinates: [parseFloat(longitude) || 0, parseFloat(latitude) || 0],
        address: address
      };

      if (req.file) {
        userData.photo = req.file.path;
      }
    }

    await User.create(userData);

    res.redirect('/signin');

  } catch (error) {
    console.error(error);
    res.render('signup', { error: 'Kuch error aa gaya, dobara try karo' });
  }
};

// GET Signin page
exports.getSignin = (req, res) => {
  res.render('signin', { error: null });
};

// POST Signin (form submit)
exports.postSignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.render('signin', { error: 'Email ya password galat hai' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('signin', { error: 'Email ya password galat hai' });
    }

    req.session.userId = user._id;
    req.session.userName = user.name;

    res.redirect('/dashboard');

  } catch (error) {
    console.error(error);
    res.render('signin', { error: 'Kuch error aa gaya, dobara try karo' });
  }
};

// Dashboard
exports.getDashboard = async (req, res) => {
  const user = await User.findById(req.session.userId);
  res.render('dashboard', { user });
};

// GET Profile page
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    res.render('profile', { user, error: null, success: null });
  } catch (error) {
    console.error(error);
    res.redirect('/dashboard');
  }
};

// POST Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, skill, experience, address, latitude, longitude, hourlyRate, bio } = req.body;
    const user = await User.findById(req.session.userId);

    user.name = name;
    user.phone = phone;

    if (user.role === 'worker') {
      user.skill = skill;
      user.experience = experience;
      user.hourlyRate = hourlyRate;
      user.bio = bio;

      if (latitude && longitude) {
        user.location = {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
          address: address
        };
      }
    }

    if (req.file) {
      user.photo = req.file.path;
    }

    await user.save();

    req.session.userName = user.name;

    res.render('profile', { user, error: null, success: 'Profile update ho gaya!' });

  } catch (error) {
    console.error(error);
    const user = await User.findById(req.session.userId);
    res.render('profile', { user, error: 'Kuch error aa gaya', success: null });
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/signin');
  });
};