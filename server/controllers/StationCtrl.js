'use strict';
var logger = require('../modules/logger');
var Station = require('./../models/station');

module.exports = {
  get: function(res) {
    Station.stationModel.find({}).then(function(results) {
      res.status(200).send({ message: results });
    }).catch(function (err) {
        logger.error(err);
        res.status(500).send(err);
    })
  },
  getById: function(id, res) {
    //TODO connect to mongodb
    res.status(200).send({ message: "Method to implements" });
  },
  create: function(station, res) {
    //TODO connect to mongodb
    let sTmp = new Station.stationModel();
    sTmp.name = station.name;
    sTmp.latitude = station.latitude;
    sTmp.longitude = station.longitude;
    sTmp.type = station.type;
    sTmp.created_at = Date.now();
    sTmp.last_update = Date.now();
    // TODO Picture
    // sTmp.picture = station.picture;
    sTmp.state = 'attente';


    sTmp.save().then(() => {
      res.status(200).send({ message: sTmp });
    }).catch(function (err) {
        logger.error(err);
        res.status(500).send(err);
    })

  },

  update: function(user, res) {

  },

  delete: function(email, res) {
    //TODO connect to mongodb
    res.status(200).send({ message: "Method to implements" });
  }
};