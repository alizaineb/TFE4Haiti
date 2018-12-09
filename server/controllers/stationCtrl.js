'use strict';
/**
 * Controlleur reprenant toutes les méthodes liées aux stations
 */

const logger = require('../config/logger');
// Modèles
const Station = require('./../models/station');
const UsersModel = require('../models/user');
// états
const states = require('../config/constants').stationState;
const userRole = require('../config/constants').roles;
const checkParam = require('./utils').checkParam;
const errors = require('./utils').errors;


/**
 * get - Récupère toutes les stations
 *
 * @param {request} req Requête du client
 * @param {response} res Réponse renvoyée au client
 *                       500 : erreur serveur
 * @return {station[]}   200 : toutes les stations
 */
exports.get = function(req, res) {
  // On récupère tous les champs
  Station.stationModel.find({},
    '_id name latitude longitude altitude state createdAt updatedAt interval bassin_versant commune user_creator_id users',
    function(err, stations) {
      if (err) {
        logger.error("[stationCtrl] get : ", err);
        return res.status(500).send("Une erreur est survenue lors de la récupération des stations");
      }
      return res.status(200).send(stations);
    });
};

/**
 * getById - Récupère une station basée sur l'id passé en paramètre
 *
 * @param {request} req Requête du client
 * @param {string} req.params.station_id L'id de la station
 * @param {response} res Réponse renvoyée au client
 *                       404 : station non trouvée
 *                       500 : erreur serveur
 * @return {station}     200 : la station ayant l'id req.params.station_id
 */
exports.getById = function(req, res) {
  Station.stationModel.findById(req.params.station_id,
    '_id name latitude longitude altitude state createdAt updatedAt interval bassin_versant commune user_creator_id users',
    function(err, station) { // Changer met (= le Gaëtan du futur) une fonciton anonyme ^^
      if (err) {
        logger.error("[stationCtrl] getById : ", err);
        return res.status(500).send("Erreur lors de la récupération de la station.");
      }
      if (station) {
        return res.status(200).send(station);
      }
      return res.status(404).send("La station n'existe pas");
    });
};

/**
 * create - Permet de créer une station en la mettant en état d'attente de confirmation par l'administrateur
 *
 * @param {request} req Requête du client
 * @param {string} req.body.name Le nom de la station
 * @param {number} req.body.latitude La latitude de la station
 * @param {number} req.body.longitude La longitude de la station
 * @param {number} req.body.altitude L'altitude de la station (optionnel)
 * @param {string} req.token_decoded.id L'id de l'utilisateur créant la station
 * @param {date} req.body.createdAt La date de création de la station
 * @param {string} req.body.interval L'intervalle de la station (ENUM)
 * @param {string} req.body.bassin_versant La rivière liée à la station (ENUM)
 * @param {string} req.body.commune La commune dans laquelle la station se situe (ENUM)
 * @param {response} res Réponse renvoyée au client
 *                       400 : Paramètre manquant ou incorrect (voir le modèle)
 *                       500 : Erreur serveur
 * @return {station}     201 : la station ajoutée en base de données
 */
exports.create = function(req, res) {

  UsersModel.userModel.findById(req.token_decoded.id, function(err, user) {
    if (err) {
      logger.error("[stationCtrl] create :", err);
      return res.status(500).send("Erreur lors de la récupération de l'user.");
    }
    if (!user) {
      return res.status(404).send("L'utilisateur n'existe pas");
    }

    let station = req.body;
    let sTmp = new Station.stationModel();
    sTmp.name = station.name;
    sTmp.latitude = station.latitude;
    sTmp.longitude = station.longitude;
    sTmp.altitude = station.altitude;
    let d = new Date(station.createdAt);
    sTmp.createdAt  = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0));
    d = new Date();
    sTmp.updatedAt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()));
    sTmp.state = states.AWAITING;
    sTmp.interval = station.interval;
    sTmp.user_creator_id = req.token_decoded.id;
    if(user.role === userRole.ADMIN) {
      sTmp.users = [];
    } else {
      sTmp.users = [req.token_decoded.id];
    }
    sTmp.commune = station.commune;
    sTmp.bassin_versant = station.bassin_versant;
    sTmp.save((err) => {
      if (err) {
        logger.error("[stationCtrl] create :", err);
        let tmp = errors(err);
        return res.status(tmp.error).send(tmp.message);
      }
      return res.status(201).send(sTmp);
    });

  });
};


/**
 * update - Permet de mettre à jour une station, il est possible de spécifier uniquement le champ à mettre à jour, dans ce cas, nous allons utiliser les anciens champs
 *
 * @param {request} req Requête du client
 * @param {string} req.params.station_id L'id de la station à mettre à jour
 * @param {string} req.body.name Le nom de la station à mettre à jour
 * @param {number} req.body.latitude La latitude de la station à mettre à jour
 * @param {number} req.body.longitude La longitude de la station à mettre à jour
 * @param {number} req.body.altitude L'altitude de la station à mettre à jour
 * @param {date} req.body.createdAt Le date de création de la station à mettre à jour // TODO RETIRER
 * @param {string} req.body.state Le state de la station à mettre à jour (ENUM) // TODO RETIRER
 * @param {string} req.body.bassin_versant Le bassin versant de la station à mettre à jour (ENUM) // TODO RETIRER
 * @param {string} req.body.commune La commune de la station à mettre à jour (ENUM) // TODO RETIRER
 * @param {response} res Réponse renvoyée au client
 *                       400 : Donnée erronnée
 *                       404 : Station inexistante
 *                       500 : Erreur serveur
 * @return {station}     201 : la station mise à jour
 */
exports.update = function(req, res) {
  Station.stationModel.findById(req.params.station_id, function(err, station) {
    if (err) {
      logger.error("[stationCtrl] update :", err);
      return res.status(500).send("Erreur lors de la récupération de la station.");
    }
    if (!station) {
      return res.status(404).send("La station n'existe pas");
    }

    // Les || permettent de reprendre les anciens champs.
    station.name = req.body.name || station.name;
    station.latitude = req.body.latitude || station.latitude;
    station.longitude = req.body.longitude || station.longitude;
    station.altitude = req.body.altitude || station.altitude;
    let d = new Date(req.body.createdAt || station.createdAt);
    station.createdAt  = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0));
    station.state = req.body.state || station.state; // TODO RETIRER
    station.bassin_versant = req.body.bassin_versant || station.bassin_versant; // TODO RETIRER
    station.commune = req.body.commune || station.commune; // TODO RETIRER

    station.save((err) => {
      if (err) {
        logger.error("[stationCtrl] update :", err);
        let tmp = errors(err);
        return res.status(tmp.error).send(tmp.message);
      }
      return res.status(201).send(station);
    });
  });
};


/**
 * delete - Permet de passer l'état de la station à delete.
 *          Etant donné le besoin de garder les données liées à la station, nous ne pouvons pas supprimer celle-ci de la base de données
 *
 * @param {request} req Requête du client
 * @param {string} req.params.station_id L'id de la station à mettre à jour
 * @param {response} res Réponse renvoyée au client
 *                       404 : Station inexistante
 *                       500 : Erreur serveur
 * @return {station}     201 : la station mise à jour dont l'état est passé à deleted
 */
exports.delete = function(req, res) {
  Station.stationModel.findById(req.params.station_id,
    'state',
    (err, station) => {
      if (err) {
        logger.error("[stationCtrl] delete1 :", err);
        let tmp = errors(err);
        return res.status(tmp.error).send(tmp.message);
      }
      if (!station) {
        return res.status(404).send("La station n'existe pas");
      }
      station.state = states.DELETED;
      station.save(function(err) {
        if (err) {
          logger.error("[stationCtrl] delete2 :", err);
          let tmp = errors(err);
          return res.status(tmp.error).send(tmp.message);
        }
        return res.status(201).send(station);
      });
    });
};




/**
 * getAllAwaiting - Permet de récupérer toutes les stations en attente
 *                  Va récupérer les champs suivants : _id name latitude longitude createdAt interval bassin_versant commune user_creator_id
 *
 * @param {request} req Requête du client
 * @param {response} res Réponse renvoyée au client
 *                       500 : Erreur serveur
 * @return {station[]}   200 : Les stations dont l'état est en attente
 */
exports.getAllAwaiting = function(req, res) {
  Station.stationModel.find({ state: states.AWAITING },
    '_id name latitude longitude createdAt interval bassin_versant commune user_creator_id',
    (err, stations) => {
      if (err) {
        logger.error("[stationCtrl] getAllAwaiting :", err);
        return res.status(500).send("Une erreur est survenue lors dela récupération des stations en attente.");
      }
      return res.status(200).send(stations);
    });
};


/**
 * acceptStation - Permet de passer une station de l'état awaiting à l'état de fonctionnement
 *
 * @param {request}   req Requête du client
 * @param {string}    req.body.station_id L'id de la station à accepter
 * @param {response}  res Réponse renvoyée au client
 *                        500 : Erreur serveur
 * @return                200
 */
exports.acceptStation = function(req, res) {
  Station.stationModel.findById(req.body.station_id,
    'state',
    (err, station) => {
      if (err) {
        logger.error("[stationCtrl] acceptStation1 :", err);
        return res.status(500).send("Un problème est survenu lors de la récupération de la station.");
      }
      if (!station) {
        return res.status(404).send("Station introuvable (peut-être a-t-elle déjà été acceptée).");
      } else {
        if (station.state !== states.AWAITING) {
          return res.status(400).send("La station a déjà été acceptée.");
        }
        station.state = states.WORKING;
        station.save((err) => {
          if (err) {
            logger.error("[stationCtrl] acceptStation2 :", err);
            return res.status(500).send("Un problème est survenu lors de la mise à jour de la station.");
          } else {
            return res.status(200).send();
          }
        });
      }
    });
};

/**
 * addUser - Permet d'ajouter un utilisateur, si il n'est pas déjà dedans, à une station en modifiant le tableau d'utilisateurs de la station
 *
 * @param {request}   req Requête du client
 * @param {string}   req.params.station_id L'id de la station pour laquelle il faut ajouter un utilisateur
 * @param {string}   req.body.user_id L'id de l'utilisateur à ajouter
 * @param {string}   req Requête du client
 * @param {response}  res Réponse renvoyée au client
 *                        404 : Station ou utilisateur inexistant
 *                        500 : Erreur serveur
 * @return {station}      200 La station mise à jour (uniquement son tableau)
 */
exports.addUser = function(req, res) {
  UsersModel.userModel.findById(req.body.user_id, function(err, user) {
    if (err) {
      logger.error("[stationCtrl] addUser1 :", err);
      return res.status(500).send("Erreur lors de la récupération de l'utilisateur.");
    }
    if (!user) {
      return res.status(404).send("L'utilisateur n'existe pas");
    }
    if (user.role != userRole.WORKER) {
      return res.status(400).send("Seul un employé peut être assigné à une station.");
    }
    Station.stationModel.findById(req.params.station_id,
      'users',
      function(err, station) {
        if (err) {
          logger.error("[stationCtrl] addUser2 :", err);
          return res.status(500).send("Erreur lors de la récupération de la station.");
        }
        if (!station) {
          return res.status(404).send("La station n'existe pas");
        }
        if (station.users.indexOf(req.body.user_id) >= 0) {
          return res.status(201).send(station);
        }
        station.users.push(req.body.user_id);
        station.save(function(err) {
          if (err) {
            logger.error("[stationCtrl] addUser3 :", err);
            return res.status(500).send("Erreur lors de la mise à jour des utilisateurs");
          }
          return res.status(201).send(station);
        });
      });
  });
};

/**
 * removeUser - Permet de retirer un utilisateur d'une station, si il est dedans, en modifiant le tableau d'utilisateur de la station
 *
 * @param {request}   req Requête du client
 * @param {string}   req.params.station_id L'id de la station pour laquelle il faut retirer un utilisateur
 * @param {string}   req.body.user_id L'id de l'utilisateur à retirer
 * @param {string}   req Requête du client
 * @param {response}  res Réponse renvoyée au client
 *                        404 : Station ou utilisateur inexistant
 *                        500 : Erreur serveur
 * @return {station}      200 La station mise à jour (uniquement son tableau)
 */
exports.removeUser = function(req, res) {
  UsersModel.userModel.findById(req.body.user_id,
    'users',
    function(err, user) {
      if (err) {
        logger.error("[stationCtrl] removeUser1 :", err);
        return res.status(500).send("Erreur lors de la récupération de l'utilisateur.");
      }
      if (!user) {
        return res.status(404).send("L'utilisateur n'existe pas");
      }

      Station.stationModel.findById(req.params.station_id, function(err, station) {
        if (err) {
          logger.error("[stationCtrl] removeUser2 :", err);
          return res.status(500).send("Erreur lors de la récupération de la station.");
        }
        if (!station) {
          return res.status(404).send("La station n'existe pas");
        }
        station.users.splice(station.users.indexOf(req.body.user_id), 1);
        station.save(function(err, station) {
          if (err) {
            logger.error("[stationCtrl] removeUser3 :", err);
            return res.status(500).send("Erreur lors de la mise à jour des utilisateurs");
          }
          return res.status(201).send(station);
        });
      });
    });
};



/**
 * getStats - Méthode utilisée pour récupérer les statistiques liées aux stations.
 *
 * @param {request}   req Requête du client
 * @param {response}  res Réponse renvoyée au client
 *                        500 : Erreur serveur
 * @return {json}      200 un objet json reprenant différentes statistiques liées aux station
 */
exports.getStats = function(req, res) {
  Station.stationModel.find({},
    'state',
    function(err, stations) {
      if (err) {
        logger.error("[stationCtrl] getStats :", err);
        return res.status(500).send("Erreur lors de la récupération des stations.");
      }
      let awaiting = 0;
      let broken = 0;
      let working = 0
      let deleted = 0;
      for (let i = 0; i < stations.length; i++) {
        let tmp = stations[i];
        if (tmp.state === states.AWAITING) {
          awaiting++;
        } else if (tmp.state === states.BROKEN) {
          broken++;
        } else if (tmp.state === states.WORKING) {
          working++;
        } else {
          // console.log("ELSE");
          deleted++;
        }
      }
      return res.status(200).send({ total: stations.length, awaiting: awaiting, broken: broken, working: working, deleted: deleted });
    });
}

/**
 * getIntervals - Permet de récupérer toutes les intervalles des stations
 *
 * @param {request} req Requête du client
 * @param {response} res Réponse renvoyée au client
 * @return {string[]}     200 : les intervalles de temps des stations
 */
exports.getIntervals = function(req, res) {
  return res.status(200).send(Station.intervals);
};


/**
 * getCommunes - Permet de récupérer les communes des stations
 *
 * @param {request} req Requête du client
 * @param {response} res Réponse renvoyée au client
 * @return {string[]}     200 : les communes des stations
 */
exports.getCommunes = function(req, res) {
  return res.status(200).send(Station.communes.sort((val1, val2) => val1.toLowerCase() < val2.toLowerCase() ? -1 : 1));
};


/**
 * getbassin_versants - Permet de récupérer les bassins versants des stations
 *
 * @param {request} req Requête du client
 * @param {response} res Réponse renvoyée au client
 * @return {string[]}     200 : les bassins versants des stations
 */
exports.getBassin_versants = function(req, res) {
  return res.status(200).send(Station.bassin_versants.sort((val1, val2) => val1.toLowerCase() < val2.toLowerCase() ? -1 : 1));
};