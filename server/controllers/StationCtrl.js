'use strict';
const logger = require('../config/logger');
const Station = require('./../models/station');
const states = require('../config/constants').stationState;
const checkParam = require('./utils').checkParam;



exports.get = function(req, res) {
  Station.stationModel.find({}).then(function(stations) {
    let tabS = [];
    stations.forEach(stations => tabS.push(stations.toDto()));
    return res.status(200).send(tabS);
  }).catch(function(err) {
    logger.error(err);
    return res.status(500).send(err);
  })
};

exports.getById = function(req, res) {
  //TODO connect to mongodb
  const id = req.params.id;
  Station.stationModel.findOne({_id: id}).then(station =>{
    return res.status(200).send(station);
  },
    err => {
      res.status(500).send("Station inexistante...");
    }
    );
};

exports.create = function(req, res) {
  checkParam(req, res, ["name", "latitude","longitude","altitude","createdAt","interval"], function() {
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
    sTmp.users = [];

    sTmp.save().then(() => {
      return res.status(201).send(sTmp);
    }).catch(function (err) {
      logger.error(err);
      return res.status(500).send(err);
    })
  });
};

exports.update = function(req, res) {
  checkParam(req, res, ["name", "latitude","longitude","altitude","createdAt","interval"], function() {
    let id = req.params.id;
    Station.stationModel.findById({ _id: id }, function(err, station) {
      if (err) return res.status(500).send("Erreur lors de la récupération de l'utilisateur concerné.");
      if (station.length > 1) return res.status(500).send("Ceci n'aurait jamais dû arriver.");
      if (station.length === 0) return res.status(404).send("La station n'existe pas");

      station.name = req.body.name;
      station.latitude = req.body.latitude;
      station.longitude = req.body.longitude;
      station.altitude = req.body.altitude;
      station.createdAt = req.body.createdAt;
      station.interval = req.body.interval;

      station.save(function (err, updatedStation) {
        if (err) return res.status(500).send("Erreur lors de l'update");
        return res.status(201).send(updatedStation);
      });
    });
  });
};

exports.delete = function(req, res) {
  let id = req.params.id;
  Station.stationModel.deleteOne({ _id: id }).then(() => {
    return res.status(204).send("ok") //TODO remove body
  }).catch(function(err) {
    logger.error(err);
    return res.status(500).send(err);
  });
};

exports.getintervals = function(req, res) {
  const intervals = ['1min', '5min', '10min', '15min', '30min', '1h', '2h', '6h', '12h', '24h'];
  return res.status(200).send(intervals);
};