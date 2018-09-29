'use strict';
const express = require('express');
const router = express.Router();

const logger = require('../modules/logger');
var permission = require('../modules/permission');
var token = require('../modules/token');

var userController = require("../controllers/UserCtrl");


router.get('/',token.validateToken, permission.isAllowed('admin'), function(req, res, next) {
  logger.info('[ROUTES] ' + req.method + ' ' + req.path);
  userController.get(res);
});

router.post('/',token.validateToken, permission.isAllowed('admin'), function(req, res, next) {
  logger.info('[ROUTES] ' + req.method + ' ' + req.path);
  userController.create(req.body, res);
});


module.exports = router;
