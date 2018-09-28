'use strict';

const server = require('../modules/server');

const logger = require('../modules/logger');

var userController = require("../controllers/UserCtrl");

server.registerRoute('GET', '/users', function(request, response) {
  logger.info('[ROUTES] ' + request.method + ' ' + request.path);
  userController.get(response);
});

server.registerRoute('GET', '/users/:id', function(request, response) {
  logger.info('[ROUTES] ' + request.method + ' ' + request.path);
  userController.getById(request.params.id, response);
});

server.registerAuthRoute('POST', '/users/', function(request, response) {
  logger.info('[ROUTES] ' + request.method + ' ' + request.path);
  userController.create(request.body, response);
}, ['admin', "user"]);

server.registerAuthRoute('PUT', '/users/', function(request, response) {
  logger.info('[ROUTES] ' + request.method + ' ' + request.path);
  userController.update(request.body, response);
});

server.registerAuthRoute('DELETE', '/users/:email', function(request, response) {
  logger.info('[ROUTES] ' + request.method + ' ' + request.path);
  userController.delete(request.params.email, response);
});
