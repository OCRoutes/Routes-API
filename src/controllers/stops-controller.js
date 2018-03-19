const stopsModel = require("../models/stops-model");

module.exports.getAllStops = async (req, res) => {
    if(req.query.lat && req.query.lon){
        stopsModel.selectAllStopsWithDistance(req.query.lat, req.query.lon, (err, stops) => {
            res.status(err ? 500 : 200).json(err ? undefined : stops);
        });
    }
    else{
        stopsModel.selectAllStops((err, stops) => {
            res.status(err ? 500 : 200).json(err ? undefined : stops);
        });
    }
};

module.exports.getStop = async (req, res) => {
    stopsModel.selectStop(req.params.stopCode, (err, stop) => {
        res.status(err ? 500 : 200).json(err ? undefined : stop);
    });
};