const express = require('express');
const tripsController = require('../controllers/trips-controller');

const router = express.Router();

router.get('/', tripsController.getAllTrips);

router.get('/:tripId', tripsController.getTrip);

module.exports = router;