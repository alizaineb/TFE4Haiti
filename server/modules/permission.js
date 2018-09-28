'use strict';
const logger = require('./logger');

/**
 *
 * Middleware that check if a the user decoded from the token is allowed
 * @param allowed A double array [ ["role1", "rolese2"]] //TODO Change to a simple array/list but I don't know how to do it in the routes file (user.js POST /users)
 * @returns {Function}
 */
var isAllowed = function(...allowed) {
  const isAllowed = role => allowed[0].indexOf(role) > -1;

  return (req, res, next) => {
    console.log("[ROLES]  allowed : ", allowed);

    if (allowed.length === 0) {
      logger.info('[ROLES] EVERY Logged user');
      next();
    }
    console.log("[ROLES] |", req.token_decoded.role, "|");
    if (req.token_decoded && isAllowed(req.token_decoded.role)) {
      next();
    } else {
      res.status(403).send({ message: "Forbidden" });
    }
  }
};

exports.isAllowed = isAllowed;