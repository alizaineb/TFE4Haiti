'use strict';
const logger = require('../config/logger');
const Note = require('./../models/note');
const checkParam = require('./utils').checkParam;
const errors = require('./utils').errors;


exports.create = function(req, res) {
  let note = req.body;
  let nTmp = new Note.noteModel();

  nTmp.station_id = note.station_id;
  nTmp.user_id = req.token_decoded.id;
  nTmp.note = note.note;

  nTmp.save().then(() => {
    return res.status(201).send(nTmp);
  }).catch(function(err) {
    logger.error(err);
    let tmp = errors(err);
    return res.status(tmp.error).send(tmp.message);
  })
};

exports.get = function(req, res) {
  let stationId = req.params.stationId;
  Note.noteModel.find({ station_id: stationId }).then(function(notes) {
    let tabN = [];
    notes.forEach(notes => tabN.push(notes.toDto()));
    return res.status(200).send(tabN);
  }).catch(function(err) {
    logger.error(err);
    return res.status(500).send("Erreur lors de la récupération des notes");
  })
};