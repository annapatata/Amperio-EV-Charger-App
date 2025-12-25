const express = require('express');
const router = express.Router();
const metaController = require('../controllers/metaController');

router.get('/filters',metaController.getFilterOptions);


module.exports = router;