const Kyc = require('../models/Kyc');
const User = require('../models/User');

// GET KYC page (form ya status, depending on current state)
exports.getKycPage = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const existingKyc = await Kyc.findOne({ worker: req.session.userId });

    res.render('kyc', { user, existingKyc, error: null });
  } catch (error) {
    console.error(error);
    res.redirect('/dashboard');
  }
};

// POST KYC submit karna
exports.submitKyc = async (req, res) => {
  try {
    const {
      profession, experience, minimumFee,
      houseNumber, street, city, district, state, pincode,
      latitude, longitude
    } = req.body;

    if (!req.files || !req.files.profileImage || !req.files.aadharCard) {
      const user = await User.findById(req.session.userId);
      return res.render('kyc', { user, existingKyc: null, error: 'Profile image aur Aadhaar dono zaroori hain' });
    }

    const profileImageUrl = req.files.profileImage[0].path;
    const aadharCardUrl = req.files.aadharCard[0].path;
    const certificateUrls = req.files.certificates ? req.files.certificates.map(f => f.path) : [];

    const kycData = {
      worker: req.session.userId,
      profession,
      experience,
      minimumFee,
      address: { houseNumber, street, city, district, state, pincode },
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude) || 0, parseFloat(latitude) || 0]
      },
      profileImage: profileImageUrl,
      aadharCard: aadharCardUrl,
      certificates: certificateUrls,
      status: 'pending'
    };

    // Agar pehle se KYC hai (rejected tha), to update karo, warna naya banao
    await Kyc.findOneAndUpdate(
      { worker: req.session.userId },
      kycData,
      { upsert: true, new: true }
    );

    await User.findByIdAndUpdate(req.session.userId, { kycStatus: 'pending' });

    res.redirect('/kyc');

  } catch (error) {
    console.error(error);
    res.redirect('/kyc');
  }
};