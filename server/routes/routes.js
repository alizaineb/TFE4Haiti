const express = require('express');
var routesJson = require('./acl/routes.json');
var jsonwebtoken = require('jsonwebtoken');
var _ = require('underscore');
var nconf = require('nconf');


// Tous les controllers de l'application
var controllers = {};
controllers.users = require('../controllers/UserCtrl');
controllers.stations = require('../controllers/StationCtrl');
// Route par défaut récupère l'index
// controllers.angular = function(req, res) { res.sendFile(path.join(__dirname, '../public/index.html')); };

var routes = [
  // API routes
  // login
  {
    path: _.findWhere(routesJson, { id: 1 }).uri,
    httpMethod: _.findWhere(routesJson, { id: 1 }).method,
    middleWare: [controllers.users.login]
  },
  {
    path: _.findWhere(routesJson, { id: 2 }).uri,
    httpMethod: _.findWhere(routesJson, { id: 2 }).method,
    middleWare: [controllers.users.logout]
  },
  {
    path: _.findWhere(routesJson, { id: 3 }).uri,
    httpMethod: _.findWhere(routesJson, { id: 3 }).method,
    middleWare: [controllers.users.create]
  },
  {
    path: _.findWhere(routesJson, { id: 4 }).uri,
    httpMethod: _.findWhere(routesJson, { id: 4 }).method,
    middleWare: [controllers.users.get]
  }
  //
];


// Applique les middleWare de vérification de sécurité
//  redirige selon le type de méthode
// Vérifie que le type de méthode existe (GET,POST, ...)
module.exports = function(app) {
  _.each(routes, function(route) {
    // Vérification des droits
    route.middleWare.unshift(ensureAuthorized);
    var args = _.flatten([route.path, route.middleWare]);

    // ToUpperCase au pour s'assurer que si qqun écrit get ça soit correct (GET normalement)
    switch (route.httpMethod.toUpperCase()) {
      case 'GET':
        app.get.apply(app, args);
        break;
      case 'POST':
        app.post.apply(app, args);
        break;
      case 'PUT':
        app.put.apply(app, args);
        break;
      case 'DELETE':
        app.delete.apply(app, args);
        break;
      default:
        throw new Error('Type de requête inconnue pour la route ' + route.path);
        break;
    }
  });
}

function ensureAuthorized(req, res, next) {
  // Ici on récup le token

  // Check le token

  // Check le droit de l'utiliasteur en le gettant dans la db (son id est dans le token)

  // Compare sa la personne a accès à la route, si non res.sendStatus(403);
  return next();
}