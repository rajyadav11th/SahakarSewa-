const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/admin/login', adminController.getAdminLogin);
router.post('/admin/login', adminController.postAdminLogin);
router.get('/admin/logout', adminController.adminLogout);

router.get('/admin/kyc-requests', adminController.isAdminAuthenticated, adminController.getKycRequests);
router.get('/admin/kyc/:kycId', adminController.isAdminAuthenticated, adminController.getKycDetail);
router.post('/admin/kyc/:kycId/approve', adminController.isAdminAuthenticated, adminController.approveKyc);
router.post('/admin/kyc/:kycId/reject', adminController.isAdminAuthenticated, adminController.rejectKyc);

module.exports = router;