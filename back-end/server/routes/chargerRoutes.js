const express = require('express');
const router = express.Router();
const chargerController = require('../controllers/chargerController');

router.get('/', chargerController.getPoints);
router.get('/:id', chargerController.getPointDetails);

module.exports = router;
