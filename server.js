'use strict';

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const schedule = require('node-schedule');
const unzip = require('unzip');

const PORT = process.env.PORT || 8080;

const GTFS_URL = 'http://www.octranspo1.com/files/google_transit.zip';
const GTFS_ZIP = 'db/google_transit.zip';
const GTFS_PATH = 'db/google_transit/';

const app = express();
app.use(bodyParser.json());

// Downloads the GTFS at 4AM every day
let downloadGTFS = schedule.scheduleJob('0 4 * * *', function(){
    request(GTFS_URL)
    .pipe(fs.createWriteStream(GTFS_ZIP))
    .on('close', function () {
        console.log(`File written at ${new Date()}`);

        fs.createReadStream(GTFS_ZIP).pipe(unzip.Extract({ path: GTFS_PATH}));

        fs.unlink(GTFS_ZIP, (err) => {
            if (err) throw err;
            console.log(`${GTFS_ZIP} was deleted`);
        });
    });
});

app.get('/ping', (req, res) => {
    res.json({
        message: 'pong'
    });
});

app.use('/routes', require('./src/routes/routes-routes'));
app.use('/stops', require('./src/routes/stops-routes'));
app.use('/trips', require('./src/routes/trips-routes'));

app.listen(PORT);

module.exports = app;