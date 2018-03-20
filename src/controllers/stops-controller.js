const stopsModel = require("../models/stops-model");

module.exports.getAllStops = async ({query: {lat = null, lon = null}}, res) => {
    try {
        var stops = await stopsModel.selectAllStops();
        if (lat && lon) {
            stops = stops.map((stop) => {
                stop.distance = getDistanceFromLatLonInKm(lat, lon, stop.stop_lat, stop.stop_lon)
                return stop
            })
        }
        stops = stops.map((stop) => {
            stop.stop_lat = parseFloat(stop.stop_lat)
            stop.stop_lon = parseFloat(stop.stop_lon)
            return stop
        })
        res.status(200).json(stops);
    } catch (error) {
        return res.status(500).json({error});
    }
};

module.exports.getStop = async (req, res) => {
    if (!req.params.stopCode) {
        res.status(400).json({error: "Missing stopCode parameter"})
    }

    try {
        const stop = await stopsModel.selectStop(req.params.stopCode);
        res.status(200).json(stop);
    } catch (error) {
        res.status(500).json({error});
    }
};

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}
