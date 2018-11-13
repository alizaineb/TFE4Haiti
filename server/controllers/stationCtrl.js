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
const checkParam = require('./utils').checkParam;



/**
 * get - Récupère toutes les stations
 *
 * @param  req /
 * @param  res 500 : erreur serveur
 * @return     200 : toutes les stations
 */
exports.get = function(req, res) {
  // On récupère tous les champs
  Station.stationModel.find({},
    '_id name latitude longitude altitude state createdAt updatedAt interval river commune user_creator_id users',
    function(err, stations) {
      if (err) {
        logger.error("[StationCtrl] get : " + err);
        return res.status(500).send("Une erreur est survenue lors de la récupération des stations");
      }
      return res.status(200).send(stations);
    });
};

/**
 * getById - Récupère une station basée sur l'id passé en paramètre
 *
 * @param  {string} req.params.station_id L'id de la station
 * @param  res 500 : erreur serveur
 *             404 : station non trouvée
 * @return     200 : la station ayant l'id req.params.station_id
 */
exports.getById = function(req, res) {
  Station.stationModel.findById(req.params.station_id,
    '_id name latitude longitude altitude state createdAt updatedAt interval river commune user_creator_id users',
    function(err, station) {
      if (err) {
        logger.error("[StationCtrl] getById : " + err);
        return res.status(500).send("Erreur lors de la récupération de la station.");
      }
      if (station) {
        return res.status(200).send(station);
      }
      return res.status(404).send("La station n'existe pas");
    });
};

exports.create = function(req, res) {
  checkParam(req, res, ["name", "latitude", "longitude", "river", "commune", "createdAt", "interval"], function() {
    let station = req.body;
    let sTmp = new Station.stationModel();
    sTmp.name = station.name;
    sTmp.latitude = station.latitude;
    sTmp.longitude = station.longitude;
    sTmp.altitude = station.altitude;
    sTmp.createdAt = new Date(station.createdAt);
    //sTmp.last_update = Date.now();
    // TODO Picture
    // sTmp.picture = station.picture;
    sTmp.state = states.AWAITING;
    sTmp.interval = station.interval;
    sTmp.user_creator_id = req.token_decoded.id;
    sTmp.users = [req.token_decoded.id];
    sTmp.commune = station.commune;
    sTmp.river = station.river;

    sTmp.save().then(() => {
      return res.status(201).send(sTmp);
    }).catch(function(err) {
      logger.error(err);
      return res.status(500).send("Une erreur est survenue lors de la création de la station");
    })
  });
};

exports.update = function(req, res) {
  checkParam(req, res, ["name", "latitude", "longitude", "river", "commune", "createdAt", "interval"], function() {
    Station.stationModel.findById(req.params.id, function(err, station) {

      if (err) {
        logger.error(err);
        return res.status(500).send("Erreur lors de la récupération de la station.");
      }
      if (station === undefined || station === null) return res.status(404).send("La station n'existe pas");
      if (station.length > 1) return res.status(500).send("Ceci n'aurait jamais dû arriver.");
      if (station.length === 0) return res.status(404).send("La station n'existe pas");

      station.name = req.body.name;
      station.latitude = req.body.latitude;
      station.longitude = req.body.longitude;
      station.altitude = req.body.altitude;
      station.createdAt = req.body.createdAt;
      station.interval = req.body.interval;
      station.river = req.body.river;
      station.commune = req.body.commune;

      station.save(function(err, updatedStation) {
        if (err) {
          logger.error(err);
          return res.status(500).send("Erreur lors de la mise à jour d'une station");
        }
        return res.status(201).send(updatedStation);
      });
    });
  });
};

exports.addUser = function(req, res) {

  console.log("Hello");

  checkParam(req, res, ["userId"], function() {
    UsersModel.userModel.findById(req.body.userId, function(err, user) {
      if (err) {
        logger.error(err);
        return res.status(500).send("Erreur lors de la récupération de l'user.");
      }
      if (user === undefined || user === null) return res.status(404).send("L'utilisateur n'existe pas");
      if (user.length > 1) return res.status(500).send("Ceci n'aurait jamais dû arriver.");
      if (user.length === 0) return res.status(404).send("L'utilisateur n'existe pas");

      Station.stationModel.findById(req.params.id, function(err, station) {
        if (err) {
          logger.error(err);
          return res.status(500).send("Erreur lors de la récupération de la station.");
        }
        if (station.length > 1) return res.status(500).send("Ceci n'aurait jamais dû arriver.");
        if (station.length === 0) return res.status(404).send("La station n'existe pas");

        station.users.addToSet(req.body.userId);

        station.save(function(err, updatedStation) {
          if (err) {
            logger.error(err);
            return res.status(500).send("Erreur lors de la mise à jour des utilisateurs");
          }
          return res.status(201).send(updatedStation);
        });
      });
    });
  });
};

exports.removeUser = function(req, res) {
  checkParam(req, res, ["userId"], function() {
    UsersModel.userModel.findById(req.body.userId, function(err, user) {
      if (err) {
        logger.error(err);
        return res.status(500).send("Erreur lors de la récupération de l'user.");
      }
      if (user === undefined || user === null) return res.status(404).send("L'utilisateur n'existe pas");
      if (user.length > 1) return res.status(500).send("Ceci n'aurait jamais dû arriver.");
      if (user.length === 0) return res.status(404).send("L'utilisateur n'existe pas");
    });

    Station.stationModel.findById(req.params.id, function(err, station) {
      if (err) {
        logger.error(err);
        return res.status(500).send("Erreur lors de la récupération de la station.");
      }
      if (station.length > 1) return res.status(500).send("Ceci n'aurait jamais dû arriver.");
      if (station.length === 0) return res.status(404).send("La station n'existe pas");

      station.users = station.users.filter(id => id !== req.body.userId);

      station.save(function(err, updatedStation) {
        if (err) {
          logger.error(err);
          return res.status(500).send("Erreur lors de la mise à jour des utilisateurs");
        }
        return res.status(201).send(updatedStation);
      });
    });
  });
};

exports.delete = function(req, res) {
  Station.stationModel.findById(req.params.id, function(err, station) {

    station.state = states.DELETED;

    station.save(function(err, updatedStation) {
      if (err) {
        logger.error(err);
        return res.status(500).send("Erreur lors de la suppression d'une station");
      }
      return res.status(201).send(updatedStation);
    });
  });
};



exports.getAllAwaiting = function(req, res) {
  Station.stationModel.find({ state: states.AWAITING }).then(function(stations) {
    let tabS = [];
    stations.forEach(station => tabS.push(station.toDto()));
    return res.status(200).send(tabS);
  }).catch(function(err) {
    logger.error(err);
    return res.status(500).send("Une erreur est survenue lors dela récupération des stations en attente.");
  });
};

exports.acceptStation = function(req, res) {
  checkParam(req, res, ["id"], () => {
    let id = req.body.id;
    Station.stationModel.find({ _id: id }).then((station) => {
      if (!station || station.length !== 1) {
        return res.status(500).send("Un problème est survenu lors de la récupération de la station.");
      } else {
        let currStation = station[0];
        currStation.state = states.WORKING;
        currStation.save((err) => {
          if (err) {
            logger.error(err);
            return res.status(500).send("Un problème est survenu lors de la mise à jour de la station.");
          } else {
            return res.status(200).send();
          }
        });
      }
    }).catch((err) => {
      logger.error(err);
      return res.status(500).send("Une erreur est survenue lors de la récupération de la station concernée.");
    });
  });
};


exports.getIntervals = function(req, res) {
  return res.status(200).send(Station.intervals);
};

exports.getCommunes = function(req, res) {
  return res.status(200).send(Station.communes.sort((val1, val2) => val1.toLowerCase() < val2.toLowerCase() ? -1 : 1));
};

exports.getRivers = function(req, res) {
  return res.status(200).send(Station.rivers.sort((val1, val2) => val1.toLowerCase() < val2.toLowerCase() ? -1 : 1));
};