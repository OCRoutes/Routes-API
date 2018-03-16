const routesModel = require("../models/routes-model");

module.exports.getAllRoutes = async (req, res) => {
    routesModel.selectAllRoutes((err, routes) => {
        res.status(err ? 500 : 200).json(err ? undefined : routes);
    });
};

module.exports.getRoute = async ({params: {routeName = null}}, res) => {
    routesModel.selectRoute(routeName, (err, route) => {
        res.status(err ? 500 : 200).json(err ? undefined : route);
    });
};