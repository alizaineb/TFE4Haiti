'use strict';

// Cette méthode va vérifier que chaque paramètre soit bien présent dans le body de la requête
// Si il manque un paramètre, elle va renvoyer un status 400 en indiquant que des inforamtions son manquantes
// Sinon elle va appeller le callback
exports.checkParam = function(req, res, params, callback) {
  for (let i = 0; i < params.length; i++) {
    if (req.body.hasOwnProperty(params[i])) {
      if (!req.body[params[i]]) {
        return res.status(400).send("Information manquante(s)");
      } else if (typeof(req.body[params[i]]) === 'string' && req.body[params[i]].trim().length == 0) {
        return res.status(400).send("Information manquante(s)");
      }
    } else {
      return res.status(400).send("Information manquante(s)");
    }
  }
  return callback();
};