'use strict';

const logger = require('../modules/logger');
const router = require('express').Router();

let server = require('../modules/server');
var permission = require('../modules/permission');
var token = require('../modules/token');

router.get('/stop', permission.isAllowed('admin'), function(req, res, next) {
  logger.info('[ROUTES] ' + req.method + ' ' + req.path);
  logger.info('[SHUTDOWN] Server shuting down by ' + req.token_decoded.email);
  res.status(200).json({message: "Server Shutting down..."});
  server.stop(process.exit(1));
});

router.get('/', function(req, res, next) {
  logger.info('[ROUTES] ' + req.method + ' ' + req.path);
  response.status(200).send({message: "Home page"});
});

module.exports = router;

