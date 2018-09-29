'use strict';
const express = require('express');
const router = express.Router();

const logger = require('../modules/logger');
var permission = require('../modules/permission');
var token = require('../modules/token');

var stationCtrl = require("../controllers/StationCtrl");


router.get('/',function(req, res, next) {
  logger.info('[ROUTES] ' + req.method + ' ' + req.path);
  stationCtrl.get(res);
});

router.post('/', token.validateToken, permission.isAllowed('admin'),function(req, res, next) {
  logger.info('[ROUTES] ' + req.method + ' ' + req.path);
  stationCtrl.create(req.body, res);
});


module.exports = router;
