const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authController = require('../controllers/authController');

router.get('/pay/:bookingId', authController.isAuthenticated, paymentController.getPaymentPage);
router.post('/verify-payment', authController.isAuthenticated, paymentController.verifyPayment);
router.post('/confirm-cod', authController.isAuthenticated, paymentController.confirmCOD);

module.exports = router;