'use strict';

const logger = require('../modules/logger');
const router = require('express').Router();

var userController = require("../controllers/UserCtrl");

router.post('/', function(req, res, next) {
  logger.info('[ROUTES] ' + req.method + ' ' + req.path);
  userController.login(req.body, res);
});

module.exports = router;