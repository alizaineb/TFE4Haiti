'use strict';
const logger = require('../config/logger');
const Station = require('./../models/station');
const User = require('./../models/users');
const states = require('../config/constants').stationState;
const checkParam = require('./utils').checkParam;
const mailTransporter = require('./mailer');



exports.get = function(req, res) {
  Station.stationModel.find({}).then(function(stations) {
    let tabS = [];
    stations.forEach(stations => tabS.push(stations.toDto()));
    return res.status(200).send(tabS);
  }).catch(function(err) {
    logger.error(err);
    return res.status(500).send("Une erreur est survenue lors de la récupération des stations");
  })
};

exports.getById = function(req, res) {
  const id = req.params.id;
  Station.stationModel.findOne({ _id: id }).then(station => {
      return res.status(200).send(station);
    },
    err => {
      logger.error(err);
      res.status(500).send("Station inexistante...");
    }
  );
};

exports.create = function(req, res) {
  checkParam(req, res, ["name", "latitude", "longitude", "altitude", "createdAt", "interval"], function() {
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

    sTmp.save().then(() => {
      return res.status(201).send(sTmp);
    }).catch(function(err) {
      logger.error(err);
      return res.status(500).send("Une erreur est survenue lors de la création de la station");
    })
  });
};

exports.update = function(req, res) {
  checkParam(req, res, ["name", "latitude", "longitude", "altitude", "createdAt", "interval"], function() {
    let id = req.params.id;
    Station.stationModel.findById({ _id: id }, function(err, station) {
      if (err) return res.status(500).send("Erreur lors de la récupération de la station.");
      if (station.length > 1) return res.status(500).send("Ceci n'aurait jamais dû arriver.");
      if (station.length === 0) return res.status(404).send("La station n'existe pas");

      station.name = req.body.name;
      station.latitude = req.body.latitude;
      station.longitude = req.body.longitude;
      station.altitude = req.body.altitude;
      station.createdAt = req.body.createdAt;
      station.interval = req.body.interval;

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

exports.delete = function(req, res) {
  Station.stationModel.findById({ _id: req.params.id }, function(err, station) {
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

exports.getintervals = function(req, res) {
  const intervals = ['1min', '5min', '10min', '15min', '30min', '1h', '2h', '6h', '12h', '24h'];
  return res.status(200).send(intervals);
};

exports.getAllAwaiting = function(req, res) {
  Station.stationModel.find({ state: states.AWAITING }).then(function(stations) {
    let tabS = [];
    let cb = 0;
    for (let i = 0; i < stations.length; i++) {
      let station = stations[i];
      // On récupère l'utilsiateur lié
      User.userModel.findById(station.user_creator_id, function(err, user) {
        console.log(user);
        if (err) {
          logger.error(err);
          return res.status(500).send("Erreur lors de la récupération de l'utilisateur lié à la station");
        } else {
          let stationTmp = station.toDto();
          stationTmp.user_creator = user;
          tabS.push(stationTmp);
          cb++;
        }
        if (cb == stations.length) {
          return res.status(200).send(tabS);
        }
      });
    }
  }).catch(function(err) {
    logger.error(err);
    return res.status(500).send("Une erreur est survenue lors dela récupération des stations en attente.");
  });
};

exports.acceptStation = function(req, res) {
  checkParam(req, res, ["id"], () => {
    let id = req.body.id;
    Station.stationModel.find({ _id: id }).then((station) => {
      if (!station || station.length != 1) {
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
}