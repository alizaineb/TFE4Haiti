'use strict';

let server = require('../modules/server');

let logger = require('../modules/logger');



server.registerAuthRoute('GET', '/server/stop', function(request, response) {
		logger.info('[ROUTES] ' + request.method + ' ' + request.path);
		logger.info('[SHUTDOWN] Server shuting down by ' + request.token_decoded.email);
		response.status(200).json({message: "Server Shutting down..."});
		server.stop(process.exit(1));
});

server.registerRoute('GET', '/', function(request, response) {
		logger.info('[ROUTES] ' + request.method + ' ' + request.path);
		response.status(200).json({message: "Home page"});
});
