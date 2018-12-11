'use strict';
/**
 * Ce controlleur contient un ensemble de méthodes utilitaire pouvant petre utilisée dans toute l'application
 */

// Nos modèles
const UsersModel = require("../models/user");
const StationModel = require('./../models/station');

// Les roles
const roles = require('../config/constants').roles;

// Le logger
const logger = require('../config/logger');

/**
 * errors - Cette methode va uniformiser les erreurs renvoyées par mongoose
 * @param l'erreur de mongoose
 * @returns {json} {error: le numéro de l'erreur, message : le message à afficher au client}
 */
exports.errors = function(err) {
  let str = "";
  let error = 500;
  for (var key in err.errors) {
    // console.log(err.errors[key]);
    if (err.errors[key].name === "CastError") {
      error = 400;
      str += "Le type d'un champ est erroné <br />";
    } else {
      str += err.errors[key].message + "<br />";
    }

    if (err.errors[key].properties &&
      (err.errors[key].properties.type === 'required' || // Required model error
        err.errors[key].properties.type === 'max' || // Max error model
        err.errors[key].properties.type === 'min' || // Min error model
        err.errors[key].properties.type === 'user defined')) { // Validator error model
      error = 400;
    }
  }
  if (str.length === 0) {
    str += "Une erreur est survenue, veuillez contacter un administrateur";
  }
  return { error: error, message: str }
};

/**
 * hasAccesToStation {Middleware} - Cette métthode va vérifier que l'utilisateur présent dans le token a accès à la station
 *                                  Cette station doit être dans req.param ou req.body sous le nom station_id (voir dans fichier routes/routes.js)
 *                                  Utilise la méthode sans état hasAccesToStationBoolean
 * Reste : Voir hasAccesToStationBoolean
 */
exports.hasAccesToStation = function(req, res, callback) {
  return hasAccesToStationBoolean(req, res, req.token_decoded.id, req.body.station_id || req.params.station_id, callback);
}

/**
 * hasAccesToStationBoolean - Méthode de vérification si un utilisateur a accès à une station en particulier.
 *
 *
 * @param {request} req Requête du client
 * @param {response} res Réponse renvoyée au client
 *                   403 : Utilisateur pas autorisé
 *                   404 : Utilisateurs inexistant, station inexistant
 *                   500 : Erreur serveur
 * @param user_id Id de l'utilisateur à vérifier
 * @param station_id Id de la station à vérifier
 *
 * @return {boolean}
 */
function hasAccesToStationBoolean(req, res, user_id, station_id, callback) {
  // Trouver l'utilisateur
  UsersModel.userModel.findById(user_id, (err, user) => {
    if (err) {
      logger.error("[UTILS] hasAccesToStationBoolean user : ", err)
      return res.status(500).send("Erreur lors de la vérification de votre accès à la station.");
    } else if (!user) {
      return res.status(404).send("Pas d'utilisateur correspondant.");
    }
    // Avant de vérifier si c'est un admin, il faut vérifier quue la station existe
    StationModel.stationModel.findById(station_id, (err, station) => {
      // console.log(station);
      if (err) {
        // Se produira si l'utilisateur rentre un id trop court/trop long
        logger.error("[UTILS] hasAccesToStationBoolean : ", err)
        return res.status(500).send("Erreur lors de la vérification de votre accès à la station.");
      } else if (!station) {
        return res.status(404).send("Pas de station correspondante.");
      }
      // Si l'utilisateur est un admin il peut passer
      if (user.role == roles.ADMIN) {
        return callback();
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

exports.hasAccesToStationBoolean = hasAccesToStationBoolean;