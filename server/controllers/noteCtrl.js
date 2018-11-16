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
 * PRE : La station a été vérifiée par le middleware hasAccesToStation, et nous sommes donc sûrs qu'elle existe
 * @param {request} req Requête du client
 * @param {response} res Réponse renvoyée au client
 *                       400 : Paramètre manquant
 *                       500 : erreur serveur
 * @return     201 : la note ajoutée en base de données
 */
exports.create = function(req, res) {
  let note = req.body;
  let nTmp = new NoteModel.noteModel();

  nTmp.station_id = note.station_id;
  nTmp.user_id = req.token_decoded.id;
  nTmp.note = note.note;
  if (note.note.trim().length === 0) {
    return res.status(400).send("La note ne peut pas être vide");
  }
  nTmp.save((err) => {
    if (err) {
      logger.error("[noteCtrl] create :", err);
      let tmp = errors(err);
      return res.status(tmp.error).send(tmp.message);
    }
    return res.status(201).send(nTmp);
  });
};


/**
 * get - Récupère toutes les notes liées à une station
 *
 * @param {request} req Requête du client
 * @param {response} res Réponse renvoyée au client
 *                       500 : Erreur serveur
 * @return {type}     200 :  les notes de la station
 */
exports.get = function(req, res) {
  NoteModel.noteModel.find({ station_id: req.params.station_id },
    '_id station_id user_id note createdAt updatedAt',
    (err, notes) => {
      if (err) {
        logger.error("[noteCtrl] get : ", err);
        return res.status(500).send("Erreur lors de la récupération des notes");
      }
      return res.status(200).send(notes);
    });
};