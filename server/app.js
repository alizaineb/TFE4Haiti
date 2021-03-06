'use strict';
const express = require('express');
const app = express();
const nconf = require('nconf');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
/**
 * =============================
 *
 * Main application.
 *
 * =============================
 */

const config = require('./config/config');
const logger = require('./config/logger')

function configureServer() {
  // Parser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json({ limit: '50mb', strict: true }));

  app.use('/', express.static('public'));


  app.use(function(request, response, next) {
    logger.info('[Server] Received request for ' + request.method + ' ' + request.path);

    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.header('Access-Control-Allow-Headers', 'Authorization, Content-Type, x-access-token');

    if (request.method === 'OPTIONS') {
      return response.sendStatus(200);
    }
    return next();
  });
}

function configureDB(cb) {
  //Connect to mongoDB server
  let url = 'mongodb://' + nconf.get('database:login') + ':' + nconf.get('database:password') + '@' + nconf.get('database:host') + ':' + nconf.get('database:port') + '/' + nconf.get('database:name');
  mongoose.set('debug', nconf.get('development'));
  mongoose.set('useCreateIndex', true);

  mongoose.connect(url, { useNewUrlParser: true }).then(
    () => {
      //Require the models
      // Import and use model in mongoose
      // require('./../models/donnee');
      // require('./../models/mdp_recuperation');
      // require('./../models/station');
      require('./models/users');

      cb()
    },
    err => {
      logger.error('[Database] Impossible de se connecter à la base de données.')
    }
  );
}

function startWebServer() {
  // Configure le serveur
  configureServer();

  //Configure la base de données
  configureDB(() => {
    //TODO : ajout d'une fvérification que la configuration mail est correcte style on envoie un mail en mode le serveur est lancé (et en dev=true ça se fait pas ^^).
    // Gestion des routes
    require('./routes/server')(app);

    // Lancement du serveur
    app.listen(nconf.get('server').port)
  });

}

process.chdir(__dirname);

// Vérification de la config
config.load(function(e) {
  if (e) {
    logger.error(e);
    return;
  }
  startWebServer();
});