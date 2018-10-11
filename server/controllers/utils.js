'use strict';

// Cette méthode va vérifier que chaque paramètre soit bien présent dans le body de la requête
// Si il manque un paramètre, elle va renvoyer un status 400 en indiquant que des inforamtions son manquantes
// Sinon elle va appeller le callback
exports.checkParam = function(req, res, params, callback) {
  for (let i = 0; i < params.length; i++) {
    console.log(params[i]);
    if (req.body.hasOwnProperty(params[i])) {
      if (!req.body[params[i]] || req.body[params[i]].trim().length == 0) {
        return res.status(400).send("Information manquante(s)");
      }
    } else {

      return res.status(400).send("Information manquante(s)");
    }
  }
  return callback();
};

exports.checkParamObj = function(obj, res, params, callback) {
  for (let i = 0; i < params.length; i++) {
    if (obj.hasOwnProperty(params[i])) {
      if (!obj[params[i]]) {
        return res.status(400).send("Information manquante(s)");
      }
    } else {
      return res.status(400).send("Information manquante(s)");
    }
  }
  return callback();
};
