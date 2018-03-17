const express = require('express');
const stopsController = require('../controllers/stops-controller');

const router = express.Router();

router.get('/', stopsController.getAllStops);

router.get('/:stopCode', stopsController.getStop);

module.exports = router;