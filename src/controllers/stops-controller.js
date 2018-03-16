const stopsModel = require("../models/stops-model");

module.exports.getAllStops = async (req, res) => {
    stopsModel.selectAllStops((err, stops) => {
        res.status(err ? 500 : 200).json(err ? undefined : stops);
    });
};

module.exports.getStop = async ({params: {stopCode = null}}, res) => {
    stopsModel.selectStop(stopCode, (err, stop) => {
        res.status(err ? 500 : 200).json(err ? undefined : stop);
    });
};