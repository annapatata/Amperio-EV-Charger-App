const express = require('express');
const router = express.Router();
const userStatsController = require('../controllers/userStatsController'); 
const verifyToken = require('../middleware/authToken');



router.get('/kpis', verifyToken, userStatsController.getKpis);

module.exports = router;
