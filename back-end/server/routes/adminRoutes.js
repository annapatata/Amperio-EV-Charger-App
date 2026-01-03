const express = require('express');
const router = express.Router();
const multer = require('multer');
const chargerController = require('../controllers/chargerController');
const adminController = require('../controllers/adminController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/healthcheck', chargerController.healthcheck);
router.post('/resetpoints', adminController.resetpoints);
router.post('/addpoints', upload.single('file'), adminController.addpoints);

module.exports = router;

