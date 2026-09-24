const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const authController = require('../controllers/authController');

router.get('/subscription', authController.isAuthenticated, subscriptionController.getSubscriptionPage);
router.get('/subscription-pay/:plan', authController.isAuthenticated, subscriptionController.getSubscriptionPayment);
router.post('/activate-free', authController.isAuthenticated, subscriptionController.activateFreePlan);
router.post('/verify-subscription', authController.isAuthenticated, subscriptionController.verifySubscriptionPayment);

module.exports = router;