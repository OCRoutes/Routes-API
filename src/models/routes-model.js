const db = require('pg-bricks').configure(process.env.DATABASE_URL);

module.exports.selectAllRoutes = async (callback) => {
    try {
        let routes = await db.select().from('routes').rows();
        callback(null, routes);
    }
    catch(e){
        callback(e, null);
    }
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