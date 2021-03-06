const logger = require('../config/logger');
const Note = require('./../models/note');
const checkParam = require('./utils').checkParam;


exports.create = function(req, res) {
  checkParam(req, res, ["note", "station_id"], function() {
    let note = req.body;
    let nTmp = new Note.noteModel();

    nTmp.station_id = note.station_id;
    nTmp.user_id = req.token_decoded.id;
    nTmp.note = note.note;

    nTmp.save().then(() => {
      return res.status(201).send(nTmp);
    }).catch(function(err) {
      logger.error(err);
      return res.status(500).send("Erreur lors de la création d'une note");
    })
  });
};

exports.get = function(req, res) {
  let stationId = req.params.stationId;
  Note.noteModel.find({station_id: stationId}).then(function(notes) {
    let tabN = [];
    notes.forEach(notes => tabN.push(notes.toDto()));
    return res.status(200).send(tabN);
  }).catch(function(err) {
    logger.error(err);
    return res.status(500).send("Erreur lors de la récupération des notes");
  })
};