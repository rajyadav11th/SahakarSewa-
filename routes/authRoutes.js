const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../config/multer');

router.get('/signup', authController.getSignup);
router.post('/signup', upload.single('photo'), authController.postSignup);

router.get('/signin', authController.getSignin);
router.post('/signin', authController.postSignin);

router.get('/dashboard', authController.isAuthenticated, authController.getDashboard);

router.get('/profile', authController.isAuthenticated, authController.getProfile);
router.post('/profile', authController.isAuthenticated, upload.single('photo'), authController.updateProfile);

router.get('/logout', authController.logout);

module.exports = router;