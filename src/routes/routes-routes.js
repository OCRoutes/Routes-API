const express = require('express');
const routesController = require('../controllers/routes-controller');

const router = express.Router();

router.get('/', routesController.getAllRoutes);

router.get('/:routeName', routesController.getRoute);

module.exports = router;