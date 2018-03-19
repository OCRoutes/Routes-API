const db = require('pg-bricks').configure(process.env.DATABASE_URL || `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@localhost:5432/routes`);

module.exports.selectAllStops = async (callback) => {
    try {
        let stops = await db.select().from('stops').rows();
        callback(null, stops);
    }
    catch(e){
        callback(e, null);
    }
}

module.exports.selectAllStopsWithDistance = async (lon, lat, callback) => {
    try {
        let stops = await db.select().from('stops').rows();
        //let stopsWithDistance = [];

        for(stop in stops){
            console.log(stop)
            stop.distance = calculateDistance(stop.stop_lat, stop.stop_lon, lon, lat);
            console.log(stop)
        }

        callback(null, stops);
    }
    catch(e){
        callback(e, null);
    }
}

module.exports.selectStop = async (stopCode, callback) => {
    try {
        if(req.stopCode){
            let stop = await db.select().from('stops').where({stop_code: stopCode}).row();
            callback(null, stop);
        }
        callback(null, null);
    }
    catch(e){
        callback(e, null);
    }
}

// Source https://www.movable-type.co.uk/scripts/latlong.html
function calculateDistance(lat1, lon1, lat2, lon2){
    let R = 6371;
    let φ1 = lat1.toRadians();
    let φ2 = lat2.toRadians();
    let Δφ = (lat2-lat1).toRadians();
    let Δλ = (lon2-lon1).toRadians();

    let a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    let d = R * c;

    return Math.round(d * 100) / 100;
}