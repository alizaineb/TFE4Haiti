'use strict';
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
const key = nconf.get("token:privateKey");
const expiration = nconf.get("token:expiration");


/**
 * createToken - Permet de créer un token valide contenant l'id de l'utilisateur et sa durée de vie
 *               Le secret est renseigné dans la configuration
 *               Cette durée de vie est renseignée dans le fichier de configuration
 * Documentation : https://github.com/auth0/node-jsonwebtoken
 *
 * @param  {User} user L'utilisateur pour lequel le token sera créée
 * @return {string} le token signé
 */
exports.createToken = function(user) {
  if (!user) {
    return undefined;
  }
  return jwt.sign({ id: user._id }, key, { expiresIn: expiration });
}


/**
 * validateToken - Permet de vérifier que le token est valide
 *
 * @param  {string} req.headers['x-access-token'] -  L'emplacement du token
 * @param  {callback} next -  la méthode devant être apellée si le token est valide
 * @return {callback} next - Appel à next
 */
exports.validateToken = function(req, res, next) {
  var token = req.headers['x-access-token'];
  if (token) {
    // Vérifie le secret ainsi que sa durée de validation
    jwt.verify(token, key, function(err, decoded) {
      if (err) {
        return res.status(401).send('Failed to authenticate token.');
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