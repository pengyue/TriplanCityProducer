'use strict';

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', reason.stack || reason)
})

process.on('unhandledError', (reason, promise) => {
    console.log('Unhandled Error at:', reason.stack || reason)
})

const config = require('./resource/config');
require('async');

const express = require('express');
const app  = express();

//health check
app.get(config.HEALTH_LIVENESS, function (req, res) {
	res.send("Health liveness passed");
});
app.get(config.HEALTH_READINESS, function (req, res) {
	res.send("Health readiness passed");
});

app.listen(config.PORT, config.HOST);
console.log(`Running on http://${config.HOST}:${config.PORT}`);

const countryConsumer = require('./app/domain/lonely_planet/country_consumer');

countryConsumer.run();