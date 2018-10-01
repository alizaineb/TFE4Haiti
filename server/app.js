'use strict';
var express = require('express');
var app = express();
var nconf = require('nconf');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
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

var configureServer = function() {
  // Parser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json({ limit: '50mb', strict: true }));

  app.use(function(request, response, next) {
    logger.info('[Server] Received request for ' + request.method + ' ' + request.path);

    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Authorization');

    if (request.method === 'OPTIONS') {
      response.sendStatus(200);
      return;
    }
    logger.info('[Server] next()');
    next();
  });
};

var configureDB = function() {
  //Connect to mongoDB server
  let url = 'mongodb://' + nconf.get('database:host') + ':' + nconf.get('database:port') + '/' + nconf.get('database:name');
  mongoose.connect(url, { useNewUrlParser: true });
  mongoose.set('debug', true);
  //Require the models
  // Import and use model in mongoose
  // require('./../models/donnee');
  // require('./../models/mdp_recuperation');
  // require('./../models/station');
  require('./models/thiessenPolygon');
  require('./models/users');

};

function startWebServer() {
  configureServer();
  configureDB();
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