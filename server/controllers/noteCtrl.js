const logger = require('../config/logger');
const Note = require('./../models/note');
const checkParam = require('./utils').checkParam;


exports.create = function(req, res) {
  checkParam(req, res, ["note", "user_id", "station_id", "createdAt"], function() {
    let note = req.body;
    let nTmp = new Note.noteModel();

    nTmp.station_id = note.station_id;
    nTmp.user_id = note.user_id;
    nTmp.note = note.note;

    nTmp.save().then(() => {
      return res.status(201).send(nTmp);
    }).catch(function(err) {
      logger.error(err);
      return res.status(500).send(err);
    })
  });
};

exports.get = function(req, res) {
  Note.noteModel.find({}).then(function(notes) {
    let tabN = [];
    notes.forEach(notes => tabN.push(notes.toDto()));
    return res.status(200).send(tabN);
  }).catch(function(err) {
    logger.error(err);
    return res.status(500).send(err);
  })
};