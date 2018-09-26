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
const configFileName = 'config.json';

/**
 * Load configuration found in the config file.
 *
 * @param callback return an error or null
 */
var load = function(callback) {
  // Vérification que le fichier de config existe
  fs.exists(__dirname + '/../' + configFileName, function(exists) {
    // Créer la config
    if (!exists) {
      createDefaultCfgFile();
    } else {
      // Vérifier la config

    }
  });
  // Start loading config
  logger.info('[Config] Start loading config file: ' + configFileName);
  // Read file content
  fs.readFile(configFileName, 'utf8', function(err, fileContents) {
    // If an error occured
    if (err) {
      if (callback) callback(new Error('[Config] Unable to read the configuration file ' + configFileName + ': ' + err.message));
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
      logger.info('[Config] Config file ' + configFileName + ' loaded');
      if (callback) callback(null);
    } catch (err) {
      if (callback) callback(new Error('[Config] Unable to parse the configuration file ' + configFileName + ': ' + err.message));
    }
  });
};

function createDefaultCfgFile(callback) {
  console.log('[Info] Création d\'un nouveau fichier de configuration');
  nconf.argv().env().file({ file: __dirname + "/../" + configFileName });
  nconf.set('jwt_private_key', 'somethingsomethingjsontoken');
  nconf.set('server:host', '0.0.0.0');
  nconf.set('server:port', '3000');
  nconf.set('database:host', 'localhost');
  nconf.set('database:port', '27017');
  nconf.set('database:name', 'TFE4Haiti');
  nconf.set('database:collections:user', 'user');
  nconf.set('database:collections:rainData', 'rainData');
  nconf.set('database:collections:pwdRecovery', 'pwdRecovery');
  nconf.set('database:collections:station', 'station');
  nconf.set('database:collections:thiessenPolygon', 'thiessenPolygon');
  nconf.set('database:login', '');
  nconf.set('database:password', '');

  nconf.save(function(err) {
    fs.readFile(__dirname + "/../" + configFileName, function(err, data) {
      if (err) {
        console.error("Erreur durant la création du fichier de configuration :  \n" + error);
      }
    });
  });
}
/**
 * Exports
 */

// Methods
exports.load = load;