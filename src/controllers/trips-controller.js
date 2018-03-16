const tripsModel = require("../models/trips-model");

module.exports.getAllTrips = async (req, res) => {
    tripsModel.selectAllTrips((err, trips) => {
        res.status(err ? 500 : 200).json(err ? undefined : trips);
    });
};

module.exports.getTrip = async ({params: {tripId = null}}, res) => {
    tripsModel.selectTrip(tripId, (err, trip) => {
        res.status(err ? 500 : 200).json(err ? undefined : trip);
    });
};