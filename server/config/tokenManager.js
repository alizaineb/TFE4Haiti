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
 *    - createToken(user)
 *    - validateToken(request, response, next) //middleWare
 *
 * Events : /
 *
 * =============================
 */
/**
 * Load modules
 */
// Built-in
const logger = require('./logger');
const jwt = require('jsonwebtoken');
const nconf = require('nconf');

//custom
var key = nconf.get("token:privateKey");
var expiration = nconf.get("token:expiration");
/**
 * Initialize logger
 */
exports.createToken = function(user) {
  if (!user) {
    return undefined;
  }
  return jwt.sign({ id: user._id }, key, { expiresIn: expiration }); //encode the user and set the expiration time in 1 hour
}
exports.validateToken = function(req, res, next) {
  var token = req.query.token || req.headers['x-access-token'];
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, key, function(err, decoded) {
      if (err) {
        return res.status(400).send({ "error": true, "message": 'Failed to authenticate token.' });
      }
      req.token_decoded = decoded;
      return next();
    });
  }
  // Lorsque l'utilsateur n'a pas de token
  else {
    return next();
  }
};