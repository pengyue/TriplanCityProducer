'use strict';

// Constants
const PORT = (process.env.PRODUCER_NODE_UI_LISTEN_PORT) ? process.env.PRODUCER_NODE_UI_LISTEN_PORT : 80;
const HOST = '0.0.0.0';
const HEALTH_LIVENESS = "/health-liveness";
const HEALTH_READINESS = "/health-readiness";

const express = require('express');
const app  = express();

//health check
app.get(HEALTH_LIVENESS, function (req, res) {
	res.send ("Health liveness passed");
});
app.get(HEALTH_READINESS, function (req, res) {
	res.send ("Health readiness passed");
});

// App
app.get('/', function (req, res) {
  res.render('index');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

require('./app/lonely_planet/country_consumer');

