'use strict';

const fs = require('fs');
const pg = require('pg');
const express = require('express');
const request = require('request');
const schedule = require('node-schedule');
const unzip = require('unzip');

const PORT = 8080;
const HOST = '0.0.0.0';

const GTFS_URL = 'http://www.octranspo1.com/files/google_transit.zip';
const GTFS_ZIP = 'db/google_transit.zip';
const GTFS_PATH = 'db/google_transit/';

const app = express();

let job = schedule.scheduleJob('0 0 * * *', function(){
    request(GTFS_URL)
    .pipe(fs.createWriteStream(GTFS_ZIP))
    .on('close', function () {
        console.log(`File written at ${new Date()}`);

        fs.createReadStream(GTFS_ZIP)
            .pipe(unzip.Extract({ path: GTFS_PATH}));

        fs.unlink(GTFS_ZIP, (err) => {
            if (err) throw err;
            console.log(`${GTFS_ZIP} was deleted`);
            });
    });
});

app.get('/ping', (req, res) => {
    res.send(JSON.stringify('pong'));
});

app.listen(PORT, HOST);

console.log(`Running on http://${HOST}:${PORT}`);