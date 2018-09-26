'use strict';
/**
 * =============================
 *
 * Load config for the application from a config file
 * and allow access it easily.
 *
 * The values are in read-only mode. Please NEVER
 * update them. Any update will impact all the app...
 *
 * =============================
 *
 * Attributes :
 *		- All the config key-values in read-only mode.
 *
 * Methods :
 *		- load([callback])
 *
 * Events : /
 *
 * =============================
 */

/**
 * Load modules
 */

const fs = require('fs');
const nconf = require('nconf');
const logger = require('./logger.js');

/**
 * Variables
 */

// An array of files that will be used to find the bootstrap.properties file
const file = 'config.json';

/**
 * Load configuration found in the config file.
 *
 * @param callback return an error or null
 */
const load = function(callback) {
  // Vérification que le fichier de config existe
  fs.exists(__dirname + '/cofnig.json', function(exists) {
    // Créer la config
    if (!exists) {

    } else {
      // Vérifier la config

    }
  });
  // Start loading config
  logger.info('[Config] Start loading config file: ' + file);
  // Read file content
  fs.readFile(file, 'utf8', function(err, fileContents) {
    // If an error occured
    if (err) {
      //TODO Generate a default config file
      if (callback) callback(new Error('[Config] Unable to read the configuration file ' + file + ': ' + err.message));
      return;
    }

    // If file read
    try {
      // Populate config
      var parsedConfig = JSON.parse(fileContents);
      for (let key in parsedConfig) {
        exports[key] = parsedConfig[key];
      }

      // Done
      logger.info('[Config] Config file ' + file + ' loaded');
      if (callback) callback(null);
    } catch (err) {
      if (callback) callback(new Error('[Config] Unable to parse the configuration file ' + file + ': ' + err.message));
    }
  });
};

/**
 * Exports
 */

// Methods
exports.load = load;