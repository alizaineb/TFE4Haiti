'use strict';
/**
 * Ce controlleur contient un ensemble de méthodes utilitaire pouvant petre utilisée dans toute l'application
 */

const UsersModel = require("../models/user");
const StationModel = require('./../models/station');
const roles = require('../config/constants').roles;
const logger = require('../config/logger');

/**
 * checkParam - Cette méthode va vérifier que chaque paramètre soit bien présent dans le body de la requête
 *              Si il manque un paramètre, elle va renvoyer un status 400 en indiquant que des inforamtions son manquantes
 *
 * @param  req      requete du client
 * @param  res      réponse concernant le client
 * @param {string[]} params   Tableau reprenant les paramètres requis
 * @param  callback Méthode qui va être appelée si tout se passe bien
 * @return          Si tout se passe bien appel du callback
 */
exports.checkParam = function(req, res, params, callback) {
  for (let i = 0; i < params.length; i++) {
    if (req.body.hasOwnProperty(params[i])) {
      if (!req.body[params[i]]) {
        return res.status(400).send("Information manquante(s)");
      } else if (typeof(req.body[params[i]]) === 'string' && req.body[params[i]].trim().length === 0) {
        return res.status(400).send("Information manquante(s)");
      }
    } else {
      return res.status(400).send("Information manquante(s)");
    }
  }
  return callback();
};

/**
 * hasAccesToStation {Middleware} - Cette métthode va vérifier que l'utilisateur présent dans le token a accès à la station
 *                                  Cette station doit être dans param sous le nom id_station (voir dans fichier routes/routes.js)
 *
 * @param  callback Méthode qui va être appelée si tout se passe bien
 * @return          Si tout se passe bien appel du callback
 */
exports.hasAccesToStation = function(req, res, callback) {
  // Trouver l'utilisateur
  UsersModel.userModel.findById(req.token_decoded.id, (err, user) => {
    if (err) {
      logger.error("[UTILS] hasAccesToStation user : ", err)
      return res.status(500).send("Erreur lors de la vérification de votre accès à la station.");
    } else if (!user) {
      return res.status(404).send("Pas d'utilisateur correspondant.");
    }
    // Si l'utilisateur est un admin il peut passer
    if (user.role == roles.ADMIN) {
      return callback();
    }
    StationModel.stationModel.findById(req.params.station_id, (err, station) => {
      if (err) {
        logger.error("[UTILS] hasAccesToStation station : ", err)
        return res.status(500).send("Erreur lors de la vérification de votre accès à la station.");
      } else if (!station) {
        return res.status(404).send("Pas de station correspondant.");
      }
      // On a la station et l'utilisateur
      // Il y a 3 checks à faire
      // Commune :
      if (user.commune === station.commune) {
        return callback();
      }
      // Rivière :
      if (user.river === station.river) {
        return callback();
      }
      // assignée
      if (station.users && station.users.indexOf(user._id) > -1) {
        return callback();
      }
      return res.status(403).send("Vous n'avez pas accès à cette station.");
    });
  });
}