const express = require('express');
const router = express.Router();
const reservationsController = require('../controllers/reservationsController'); 
const verifyToken = require('../middleware/authToken');

router.get('/upcoming', verifyToken, reservationsController.getUpcoming);

module.exports = router;
