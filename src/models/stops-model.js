const db = require('pg-bricks').configure(process.env.DATABASE_URL);

module.exports.selectAllStops = async (callback) => {
    try {
        let stops = await db.select().from('stops').rows();
        callback(null, stops);
    }
    catch(e){
        callback(e, null);
    }
}

module.exports.selectStop = async (stopCode, callback) => {
    try {
        let stop = await db.select().from('stops').where({stop_code: stopCode}).row();
        callback(null, stop);
    }
    catch(e){
        callback(e, null);
    }
}