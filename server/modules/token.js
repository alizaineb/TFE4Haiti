/**
 * =============================
 *
 * Simple module to create and validate a token with jwt
 *
 * =============================
 *
 * Attributes : /
 *
 * Methods :
 *		- createToken(user)
 *		- validateToken(request, response, next) //middleWare
 *
 * Events : /
 *
 * =============================
 */



/**
 * Load modules
 */

// Built-in
const logger = require('../modules/logger');
const jwt = require('jsonwebtoken');

//custom
var config = require('./config');

var createKey = function(){
	return  config.jwt_private_key;
}


/**
 * Initialize logger
 */
 
var createToken = function(user){
	var key = createKey();
	return jwt.sign({id: user.id, email: user.email}, key, {expiresIn: 1440}); //encode the user and set the expiration time in 1 hour
}


var validateToken = function(req, res, next) {
	var token = req.query.token || req.headers['x-access-token'];
	var email = req.query.token || req.headers['x-access-email'];
	
	if (token && email) {
	    // verifies secret and checks exp
	    
	    var key = createKey();
	    jwt.verify(token, key, function(err, decoded) {
	        if (err) {
	            return res.json({"error": true, "message": 'Failed to authenticate token.' });
	        }
	      req.token_decoded = decoded;
	      next();
	    });
	} else {
		// if there is no token
		// return an error
		return res.status(403).send({
		    "error": true,
		    "message": 'A token and email address must be provided.'
		});
	}
};


/**
 * Exports
 */

// Methods
exports.createToken = createToken;
exports.validateToken = validateToken;