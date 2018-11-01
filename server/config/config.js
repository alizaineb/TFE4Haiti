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
const path = require('path');
const fs = require('fs');
const nconf = require('nconf');
const logger = require('./logger.js');

/**
 * Variables
 */

// An array of files that will be used to find the bootstrap.properties file
const configFileName = 'config.json';
const fullConfigFileName = __dirname + '/../' + configFileName;

/**
 * Load configuration found in the config file.
 *
 * @param callback return an error or null
 */
exports.load = function(callback) {
  // Vérification que le fichier de config existe
  fs.exists(fullConfigFileName, function(exists) {
    // Créer la config
    if (!exists) {
      createDefaultCfgFile(function(err) {
        if (err) {
          logger.error('[Config] Erreur lors de la création du fichier de configuration');
          callback(err);
        } else {
          callback(null);
        }
      });
    } else {
      // Vérifier la config
      checkCfg(function(err) {
        if (err) {
          logger.error('[Config] Erreur lors de la vérification du fichier de configuration');
          callback(err);
        } else {
          logger.info('[Config] Fichier de configuration vérifié');
          callback(null);
        }
      });
    }
  });
};

function createDefaultCfgFile(callback) {
  logger.warn('[Config]  Création d\'un nouveau fichier de configuration');
  logger.error('/!\\ Un fichier de configuration par défaut a été créé.\nLe serveur va fonctionner avec des valeurs par défaut. Pour des raisons de sécurité et assurer une fonctionnement total de l\'application, veuillez le modifier.\nPour de plus amples informations référez-vous à la documentation.');
  nconf.argv().env().file({ file: fullConfigFileName });
  nconf.set('development', true);
  nconf.set('uploadFolder', path.join(__dirname, '..', 'public', 'upload'));
  nconf.set('downloadFolder', path.join(__dirname, '..', 'public', 'download'));
  nconf.set('token:privateKey', 'somethingsomethingjsontoken'); // 1h
  nconf.set('token:expiration', 1440); // 1h
  nconf.set('server:host', '0.0.0.0');
  nconf.set('server:port', '3000');
  nconf.set('database:host', 'localhost');
  nconf.set('database:port', '27017');
  nconf.set('database:name', 'TFE4Haiti');
  nconf.set('database:login', '');
  nconf.set('database:password', '');
  nconf.set('mail:host', '');
  nconf.set('mail:port', '');
  nconf.set('mail:user', '');
  nconf.set('mail:pwd', '');
  nconf.set('mail:secure', true);
  nconf.set('mail:subjectCreationAccOk', '');
  nconf.set('mail:subjectCreationAccRefused', '');
  nconf.set('mail:changePwd', '');
  nconf.set('user:accountAcceptedTime', 60 * 60 * 24 * 7); // Une semaine
  nconf.set('user:changePwdTime', 60 * 60 * 24); // Un jour

  nconf.save(function(err) {
    fs.readFile(fullConfigFileName, function(err, data) {
      if (err) {
        callback(err);
      } else {
        callback(null);
      }
    });
  });
}

function checkCfg(callback) {
  logger.info('[Config] Vérification du fichier de configuration');
  var cfgModified = false;
  nconf.file(fullConfigFileName);
  if (typeof nconf.get('development') === "undefined") {
    nconf.set('development', true)
    cfgModified = true;
  }
  if (typeof nconf.get('uploadFolder') === "undefined") {
    nconf.set('uploadFolder', path.join(__dirname, '..', 'public', 'upload'))
    cfgModified = true;
  }
  if (typeof nconf.get('downloadFolder') === "undefined") {
      nconf.set('downloadFolder', path.join(__dirname, '..', 'public', 'download'))
      cfgModified = true;
  }
  if (typeof nconf.get('server:host') === "undefined") {
    nconf.set('server:host', '0.0.0.0');
    cfgModified = true;
  }
  if (typeof nconf.get('server:port') === "undefined") {
    nconf.set('server:port', '3000');
    cfgModified = true;
  }
  if (typeof nconf.get('database:host') === "undefined") {
    nconf.set('database:host', 'localhost');
    cfgModified = true;
  }
  if (typeof nconf.get('database:port') === "undefined") {
    nconf.set('database:port', '27017');
    cfgModified = true;
  }
  if (typeof nconf.get('database:name') === "undefined") {
    nconf.set('database:name', 'TFE4Haiti');
    cfgModified = true;
  }
  if (typeof nconf.get('database:login') === "undefined") {
    nconf.set('database:login', '');
    cfgModified = true;
  }
  if (typeof nconf.get('database:password') === "undefined") {
    nconf.set('database:password', '');
    cfgModified = true;
  }
  if (typeof nconf.get('token:privateKey') === "undefined") {
    nconf.set('token:privateKey', 'somethingsomethingjsontoken');
    cfgModified = true;
  }
  if (typeof nconf.get('token:expiration') === "undefined") {
    nconf.set('token:expiration', 1440);
    cfgModified = true;
  }
  if (typeof nconf.get('mail:host') === "undefined") {
    nconf.set('mail:host', '');
    cfgModified = true;
  }
  if (typeof nconf.get('mail:port') === "undefined") {
    nconf.set('mail:port', '');
    cfgModified = true;
  }
  if (typeof nconf.get('mail:user') === "undefined") {
    nconf.set('mail:user', '');
    cfgModified = true;
  }
  if (typeof nconf.get('mail:pwd') === "undefined") {
    nconf.set('mail:pwd', '');
    cfgModified = true;
  }
  if (typeof nconf.get('mail:secure') === "undefined") {
    nconf.set('mail:secure', true);
    cfgModified = true;
  }
  if (typeof nconf.get('mail:subjectCreationAccOk') === "undefined") {
    nconf.set('mail:subjectCreationAccOk', '');
    cfgModified = true;
  }
  if (typeof nconf.get('mail:subjectCreationAccRefused') === "undefined") {
    nconf.set('mail:subjectCreationAccRefused', '');
    cfgModified = true;
  }
  if (typeof nconf.get('mail:changePwd') === "undefined") {
    nconf.set('mail:changePwd', '');
    cfgModified = true;
  }
  if (typeof nconf.get('user:accountAcceptedTime') === "undefined") {
    nconf.set('user:accountAcceptedTime', 60 * 60 * 24 * 7); // Une semaine
    cfgModified = true;
  }
  if (typeof nconf.get('user:changePwdTime') === "undefined") {
    nconf.set('user:changePwdTime', 60 * 60 * 24); // Un jour
    cfgModified = true;
  }
  // La configuration a été changée
  if (cfgModified) {
    logger.info('[Config] Le fichier de configuration a été modifié');
    nconf.save(function(err) {
      fs.readFile(fullConfigFileName, function(err, data) {
        if (err) {
          logger.error("[Config] Erreur durant la vérification du fichier de configuration :  \n" + err);
        } else {
          logger.error('/!\\ Le fichier de configuration a été modifié.\nLe serveur va fonctionner avec des valeurs par défaut. Pour des raisons de sécurité et assurer une fonctionnement total de l\'application, veuillez le modifier.\nPour de plus amples informations référez-vous à la documentation.');
          callback(null);
        }
      });
    });
  } else {
    callback(null);
  }
}