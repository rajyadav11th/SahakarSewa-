const express = require('express');
const router = express.Router();
const kycController = require('../controllers/kycController');
const authController = require('../controllers/authController');
const upload = require('../config/multer');

router.get('/kyc', authController.isAuthenticated, kycController.getKycPage);

router.post('/kyc', authController.isAuthenticated, upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'aadharCard', maxCount: 1 },
  { name: 'certificates', maxCount: 5 }
]), kycController.submitKyc);

module.exports = router;