const db = require('pg-bricks').configure(process.env.DATABASE_URL || `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@localhost:5432/routes`);

module.exports.selectAllRoutes = () => {
    return db.select().from('routes_extended').rows();
}

module.exports.selectRoute = (routeName, callback) => {
    try {
        let route = db.select().from('routes').where({route_short_name: routeName}).row();
        callback(null, route);
    }
    catch(e){
        callback(e, null);
    }
}