'use strict';
const logger = require('../config/logger');
const Station = require('./../models/station');
const states = require('../config/constants').stationState;


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
  sTmp.altitude = station.altitude;
  sTmp.createdAt = new Date(station.createdAt);
  //sTmp.last_update = Date.now();
  // TODO Picture
  // sTmp.picture = station.picture;
  sTmp.state = states.AWAITING;
  sTmp.interval = station.interval;
  sTmp.users = [];

  sTmp.save().then(() => {
    return res.status(201).send({ message: sTmp });
  }).catch(function(err) {
    logger.error(err);
    return res.status(500).send(err);
  })
};

exports.update = function(req, res) {
  let id = req.params.id;
  console.log(id)
/*
  let station = req.body;
  let sTmp = new Station.stationModel();
  sTmp.name = station.name;
  sTmp.latitude = station.latitude;
  sTmp.longitude = station.longitude;
  sTmp.createdAt = new Date(station.createdAt);
  //sTmp.last_update = Date.now();
  // TODO Picture
  // sTmp.picture = station.picture;
  sTmp.state = station.state;
  sTmp.interval = station.interval;
  sTmp.users = station.users;
  sTmp.interval = station.interval;
  sTmp.save().then(() => {
    return res.status(201).send({ message: sTmp });
  }).catch(function(err) {
    logger.error(err);
    return res.status(500).send(err);
  })*/
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

exports.getintervals = function(req, res) {
  const intervals = ['1min','5min','10min','15min','30min','1h','2h','6h','12h','24h'];
  return res.status(200).send(intervals);
};