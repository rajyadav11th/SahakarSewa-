const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Kyc = require('../models/Kyc');
const User = require('../models/User');

// GET Admin login page
exports.getAdminLogin = (req, res) => {
  res.render('admin-login', { error: null });
};

// POST Admin login
exports.postAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.render('admin-login', { error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.render('admin-login', { error: 'Invalid credentials' });
    }

    req.session.adminId = admin._id;
    res.redirect('/admin/kyc-requests');

  } catch (error) {
    console.error(error);
    res.render('admin-login', { error: 'Kuch error aa gaya' });
  }
};

// Middleware: admin logged in hai check karo
exports.isAdminAuthenticated = (req, res, next) => {
  if (req.session.adminId) {
    next();
  } else {
    res.redirect('/admin/login');
  }
};

// GET Pending KYC list
exports.getKycRequests = async (req, res) => {
  try {
    const kycRequests = await Kyc.find({ status: 'pending' }).populate('worker').sort({ createdAt: 1 });
    res.render('admin-kyc-list', { kycRequests });
  } catch (error) {
    console.error(error);
    res.redirect('/admin/login');
  }
};

// GET single KYC detail
exports.getKycDetail = async (req, res) => {
  try {
    const kyc = await Kyc.findById(req.params.kycId).populate('worker');
    if (!kyc) return res.redirect('/admin/kyc-requests');
    res.render('admin-kyc-detail', { kyc });
  } catch (error) {
    console.error(error);
    res.redirect('/admin/kyc-requests');
  }
};

// POST Approve KYC
exports.approveKyc = async (req, res) => {
  try {
    const kyc = await Kyc.findById(req.params.kycId);
    kyc.status = 'approved';
    await kyc.save();

    await User.findByIdAndUpdate(kyc.worker, { kycStatus: 'approved' });

    res.redirect('/admin/kyc-requests');
  } catch (error) {
    console.error(error);
    res.redirect('/admin/kyc-requests');
  }
};

// POST Reject KYC
exports.rejectKyc = async (req, res) => {
  try {
    const { reason } = req.body;
    const kyc = await Kyc.findById(req.params.kycId);
    kyc.status = 'rejected';
    kyc.rejectionReason = reason;
    await kyc.save();

    await User.findByIdAndUpdate(kyc.worker, { kycStatus: 'rejected' });

    res.redirect('/admin/kyc-requests');
  } catch (error) {
    console.error(error);
    res.redirect('/admin/kyc-requests');
  }
};

// Admin logout
exports.adminLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
};