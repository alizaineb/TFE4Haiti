'use strict';

/**
 * Controlleur reprenant toutes les méthodes liées aux stations
 */

const logger = require('../config/logger');
// Modèles
const NoteModel = require('./../models/note');

//Gestion des erreurs
const errors = require('./utils').errors;


/**
 * create - Permet de créer une note pour une station
 *
 * @param {request} req Requête du client
 * @param {response} res Réponse renvoyée au client
 *                       400 : Paramètre manquant
 *                       500 : erreur serveur
 * @return     200 : la note ajoutée en base de données
 */
exports.create = function(req, res) {
  let note = req.body;
  let nTmp = new NoteModel.noteModel();

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
  NoteModel.noteModel.find({ station_id: stationId }).then(function(notes) {
    let tabN = [];
    notes.forEach(notes => tabN.push(notes.toDto()));
    return res.status(200).send(tabN);
  }).catch(function(err) {
    logger.error(err);
    return res.status(500).send("Erreur lors de la récupération des notes");
  })
};