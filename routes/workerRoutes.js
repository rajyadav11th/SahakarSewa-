const express = require('express');
const router = express.Router();
const workerController = require('../controllers/workerController');

router.get('/workers/:skill', workerController.getWorkersBySkill);
router.get('/worker-profile/:workerId', workerController.getWorkerProfile);

module.exports = router;