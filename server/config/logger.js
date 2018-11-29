'use strict';
/**
 * =============================
 *
 * Logger to log messages for the application.
 * This is a simple wrapper for the "winston" logger.
 *
 * =============================
 *
 * Attributes : /
 *
 * Methods :
 *		- info(message)
 *		- warn(message)
 *		- error(message)
 *
 * Events : /
 *
 * =============================
 */



/**
 * Load modules
 */

// Built-in
const winston = require('winston');

/**
 * Initialisation du logger
 */
//TODO Find better way to log date
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.printf(info => info.message + '\n________________________________________________________\n' + JSON.stringify(info)),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf( info => `${new Date().toLocaleString('fr-BE')}\t${info.level}:  ${info.message}`)
      )
    })
  ],
  exceptionHandlers: [
    new winston.transports.Console({ format: winston.format.simple(), colorize: true, timestamp: true })
  ],
  exitOnError: false
});


/**
 * Export du logger
 */
exports = module.exports = logger;