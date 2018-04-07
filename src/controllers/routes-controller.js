const routesModel = require("../models/routes-model");

module.exports.getAllRoutes = async (req, res) => {
    try {
        let routes = await routesModel.selectAllRoutes();

        routes = routes.sort((a, b) => {
            if(isNaN(a.route_name)){
                return 1;
            }
            else if(isNaN(b.route_name)){
                return -1;
            }
            else{
                return parseInt(a.route_name) - parseInt(b.route_name);
            }
        });

        res.status(200).json(routes);
    } catch (error) {
        return res.status(500).json({error});
    }
};

module.exports.getRoute = async (req, res) => {
    if (!req.params.routeName) {
        res.status(400).json({error: "Missing routeName parameter"})
    }

    try {
        let routes = await routesModel.selectAllRoutes();

        routes = routes.sort((a, b) => {
            if(isNaN(a.route_name)){
                return 1;
            }
            else if(isNaN(b.route_name)){
                return -1;
            }
            else{
                return parseInt(a.route_name) - parseInt(b.route_name);
            }
        });

        res.status(200).json(routes);
    } catch (error) {
        return res.status(500).json({error});
    }
};