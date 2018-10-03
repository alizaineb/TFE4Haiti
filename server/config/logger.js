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
 * Initialize logger
 */
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.printf(info => info.message + '\n________________________________________________________\n' + JSON.stringify(info)),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      )
    })
  ],
  exceptionHandlers: [
    new winston.transports.Console({ format: winston.format.simple(), colorize: true, timestamp: true })
  ],
  exitOnError: false
});


/**
 * Exports
 */

// Methods
exports = module.exports = logger;