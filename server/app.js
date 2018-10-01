'use strict';
var express = require('express');
var app = express();
var nconf = require('nconf');
/**
 * =============================
 *
 * Main application.
 *
 * =============================
 */

const config = require('./modules/config');
const logger = require('./modules/logger');
const server = require('./modules/server');


function startWebServer() {
  // Vérification de la config
  require('./routes/index')(app);

  app.listen(nconf.get('server').port)
}

process.chdir(__dirname);

config.load(function(e) {
  if (e) {
    logger.error(e);
    return;
  }
  startWebServer();
});