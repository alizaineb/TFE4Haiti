'use strict';
const logger = require('../config/logger');
const Station = require('./../models/station');

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
  return res.status(200).send({ message: "Method to implements" });
};

exports.create = function(req, res) {
  let station = req.body;
  let sTmp = new Station.stationModel();
  sTmp.name = station.name;
  sTmp.latitude = station.latitude;
  sTmp.longitude = station.longitude;
  sTmp.users = [];
  //sTmp.created_at = Date.now();
  //sTmp.last_update = Date.now();
  // TODO Picture
  // sTmp.picture = station.picture;
  sTmp.state = 'attente';
  sTmp.interval = station.interval;

  sTmp.save().then(() => {
    return res.status(201).send({ message: sTmp });
  }).catch(function(err) {
    logger.error(err);
    return res.status(500).send(err);
  })
};




exports.update = function(req, res) {
  //TODO connect to mongodb
  return res.status(200).send({ message: "Method to implements" });
};

exports.delete = function(req, res) {
  let id = req.params.id;
  Station.stationModel.deleteOne({ _id: id }).then(() => {
    return res.status(204).send({ deleted: "ok" }) //TODO remove body
  }).catch(function(err) {
    logger.error(err);
    return res.status(500).send(err);
  });
};