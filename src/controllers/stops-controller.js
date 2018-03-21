const stopsModel = require("../models/stops-model");

module.exports.getAllStops = async ({query: {lat = null, lon = null, radius = null}}, res) => {
    try {
        var stops = await stopsModel.selectAllStops();
        stops = stops.map((stop) => {
            stop.stop_lat = parseFloat(stop.stop_lat);
            stop.stop_lon = parseFloat(stop.stop_lon);

            if (lat && lon) {
                stop.distance = getDistanceFromLatLonInKm(lat, lon, stop.stop_lat, stop.stop_lon);
            }

            return stop;
        });

        if(lat && lon) {
            if(radius) {
                stops = stops.filter((stop) => {
                    return stop.distance <= radius;
                });
            }

            stops = stops.sort((a, b) => {
                return a.distance - b.distance;
            });
        }

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

        if (req.query.lat && req.query.lon) {
            stop.distance = getDistanceFromLatLonInKm(req.query.lat, req.query.lon, stop.stop_lat, stop.stop_lon);
        }

        res.status(200).json(stop);
    } catch (error) {
        res.status(500).json({error});
    }
};

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2-lat1);  // deg2rad below
    const dLon = deg2rad(lon2-lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km
    return Math.round(d*100)/100;;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}
