'use strict';

const UsersModel = require("../models/users");
const StationModel = require('./../models/station');
const roles = require('../config/constants').roles;
const logger = require('../config/logger');

// Cette méthode va vérifier que chaque paramètre soit bien présent dans le body de la requête
// Si il manque un paramètre, elle va renvoyer un status 400 en indiquant que des inforamtions son manquantes
// Sinon elle va appeller le callback
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

// Middleware vérifia,t si une personne a accès à la station présente dans les paramètres de l'url.
exports.hasAccesToStation = function(req, res, callback) {
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
    StationModel.stationModel.findById(req.params.id_station, (err, station) => {
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
      return res.status(401).send("Vous ne pouvez pas modifier cette station.");
    });
  });

  // Trouver l'utilisateur
  // Si admin tu peux passer
}