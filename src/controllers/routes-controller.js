const routesModel = require("../models/routes-model");

module.exports.getAllRoutes = async (req, res) => {
    try {
        let routes = await routesModel.selectAllRoutes();

        routes = routes.sort((a, b) => {
            if(isNaN(a.route_short_name)){
                return 1;
            }
            else if(isNaN(b.route_short_name)){
                return -1;
            }
            else{
                return parseInt(a.route_short_name) - parseInt(b.route_short_name);
            }
        });

        res.status(200).json(routes);
    } catch (error) {
        return res.status(500).json({error});
    }
};

module.exports.getRoute = async ({params: {routeName = null}}, res) => {
    routesModel.selectRoute(routeName, (err, route) => {
        res.status(err ? 500 : 200).json(err ? undefined : route);
    });
};