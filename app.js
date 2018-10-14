'use strict';

// Constants
const PORT = (process.env.APP_HTTP_PORT) ? process.env.APP_HTTP_PORT : 8086;
const HOST = '0.0.0.0';
const HEALTH_LIVENESS = "/health-liveness";
const HEALTH_READINESS = "/health-readiness";

const express = require('express');
const app  = express();

//health check
app.get(HEALTH_LIVENESS, function (req, res) {
	res.send("Health liveness passed");
});
app.get(HEALTH_READINESS, function (req, res) {
	res.send("Health readiness passed");
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

require('./app/lonely_planet/country_consumer');

