'use strict';

const UsersModel = require("../models/users");
const roles = require('../config/constants').roles;

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
  UsersModel.userModel.findById(req.params.id_station, (err, user) => {
    if (err) {
      logger.error("[UTILS] hasAccesToStation : ", err)
      return res.status(500).send("Erreur lors de la vérification de votre accès à la station.");
    }
    // Si l'utilisateur est un admin il peut passer
    console.log("USR");
    console.log(user);

    if (user.role == roles.ADMIN) {
      return callback();
    }
    return res.status(500).send("TPEUX PAS");
  });

  // Trouver l'utilisateur
  // Si admin tu peux passer
}