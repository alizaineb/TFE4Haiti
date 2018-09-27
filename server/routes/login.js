'use strict';

const server = require('../modules/server');

const logger = require('../modules/logger');

const usrCtrl = require('../controllers/UserCtrl');

server.registerRoute('POST', '/login', function(request, response) {
	logger.info('[ROUTES]' + request.method + ' ' + request.path);
	usrCtrl.login(request.body, response);
})