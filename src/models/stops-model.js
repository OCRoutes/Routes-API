const db = require('pg-bricks').configure(process.env.DATABASE_URL || `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@localhost:5432/routes`);

module.exports.selectAllStops = () => {
    return db.select().from('stops').rows();
}

module.exports.selectStop = (stopCode, callback) => {
    return db.select().from('stops').where({stop_code: stopCode}).row();
}
