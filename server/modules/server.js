'use strict';

/**
 * =============================
 *
 * API Express server
 * Set the route listening on, start/stop the server...
 *
 * =============================
 *
 * Attributes : /
 *
 * Methods :
 *		- start([callback])
 *		- stop([callback])
 *
 * Events : /
 *
 * =============================
 */

/**
 * Load modules
 */

// Built-in
var express = require('express');
var bodyParser = require('body-parser');


// Custom
var logger = require('./logger');
var config = require('./config');
const token = require('./token');
var mongod = require('./mongod');

// Routes

/**
 * Variables
 */
// Server
var app = express();
var server;

/**
 * Configure application:
 *		- parse json bodies
 */
var _configureServer = function () {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));

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

/**
 * Configure application routes
 */
var _configureRoutes = function () {
	
	require("../routes/server")
	require('../routes/user');

	app.use("*",function(req,res){
		res.status(404).send({message : '404'});
	});
	
	logger.info('[SERVER] Routes loaded');
};

/**
 * Start the API Server
 *
 * @param callback function called when the web server is listening
 */
var start = function (callback) {
	_configureServer();
	_configureRoutes();

	server = app.listen(config.server.port, config.server.host, function () {
		logger.info('[Server] Web server listening on ' + config.server.host + ':' + config.server.port);
		if (callback) callback();
	});
};

/**
 * Stop the API Server
 *
 * @param callback function called when the web server is no more listening
 */
var stop = function (callback) {
	if (server && typeof server.close === 'function') {
		server.close();
		logger.warn('[Server] Web server no more listening on ' + config.server.host + ':' + process.env.PORT);
		if (callback) callback();
	} else {
		logger.warn('[Server] Cannot stop web server listening on ' + config.server.host + ':' + process.env.PORT);
		if (callback) callback();
	}
};



/**
 * Exports
 */

// Methods
exports.start = start;
exports.stop = stop;

exports.registerRoute = function(method, path, handler) {
	logger.info('[Server] Registering route ' + method + ' ' + path);
	return app[method.toLowerCase()](path, handler);
};

exports.registerAuthRoute = function(method, path, handler) {
	logger.info('[Server] Registering Auth route ');
	app[method.toLowerCase()](path, token.validateToken);
	return exports.registerRoute(method, path, handler);
};