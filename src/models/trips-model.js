const db = require('pg-bricks').configure(process.env.DATABASE_URL);

module.exports.selectAllTrips = async (callback) => {
    try {
        let trips = await db.select().from('trips').rows();
        callback(null, trips);
    }
    catch(e){
        callback(e, null);
    }
}

module.exports.selectTrip = async (tripId, callback) => {
    try {
        let trip = await db.select().from('trips').where({trip_id: tripId}).row();
        callback(null, trip);
    }
    catch(e){
        callback(e, null);
    }
}