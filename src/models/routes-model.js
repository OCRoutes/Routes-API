const db = require('pg-bricks').configure(process.env.DATABASE_URL || `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@localhost:5432/routes`);

module.exports.selectAllRoutes = () => {
    return db.raw(`SELECT DISTINCT trips.route_id, routes.route_short_name, trips.trip_headsign, trips.direction_id
                   FROM trips
                   INNER JOIN routes ON routes.route_id = trips.route_id
                   GROUP BY trips.route_id, routes.route_short_name, trips.trip_headsign, trips.direction_id;`).rows();
}

module.exports.selectRoute = async (routeName, callback) => {
    try {
        let route = await db.select().from('routes').where({route_short_name: routeName}).row();
        callback(null, route);
    }
    catch(e){
        callback(e, null);
    }
}