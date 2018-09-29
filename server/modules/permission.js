'use strict';
const logger = require('./logger');
const token = require('./token');

/**
 *
 * Middleware that check if a the user decoded from the token is allowed
 * @param allowed A double array [ ["role1", "rolese2"]] //TODO Change to a simple array/list but I don't know how to do it in the routes file (user.js POST /users)
 * @returns {Function}
 */
var isAllowed = function(...allowed) {
  const isAllowed = role => allowed.indexOf(role) > -1;

  return (req, res, next) => {
    // Validate a token;
    // token.validateToken(req, res, next);

    if (allowed.length === 0) {
      next();
    }
    if (req.token_decoded && isAllowed(req.token_decoded.role)) {
      next();
    } else {
      res.status(403).send({ message: "Forbidden" });
    }
  }
};

exports.isAllowed = isAllowed;