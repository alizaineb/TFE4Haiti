'use strict';
// Libraire node
const mongoose = require('mongoose');
// Etats
const state = require('../config/constants').DataType;

let statesEnum = [state.FILE, state.INDIVIDUAL, state.UPDATE];
// schema concernant les données pluviométriques
const Schema = mongoose.Schema;
const RainData = new Schema({
  station_id: {
    type: String,
    required: [true, 'Id de la station liée manquant, veuillez contactez un amdinistrateur']
  },
  user_id: {
    type: String,
    required: [true, 'Id de l\'utilisateur lié manquant, veuillez contactez un amdinistrateur']
  },
  date: {
    type: Date,
    required: [true, 'Date liée manquante, veuillez contactez un amdinistrateur']
  },
  value: {
    type: Number,
    required: [true, 'Valeur liée manquante, veuillez contactez un amdinistrateur'],
    min: [0, 'La valeur doit être supérieure à 0']
  }
});

/**
 * Méthode qui transforme un objet data en un tableau [date, value] compatible pour les graphs Highstocks
 * @param this
 * @returns [date, value]
 */
RainData.statics.toDtoGraphLine = function toDtoGraphLine(data) {
  return [
    data.date.valueOf(),
    data.value
  ]
};

//Definition du modèle
RainData.index({ "station_id": 1, "date": 1 }, { "unique": true });
const rainDataModel = mongoose.model("rainData", RainData);

// Export du modèle
exports.rainDataModel = rainDataModel;



// awaiting
const RainDataAwaiting = new Schema({
  station_id: {
    type: String,
    required: [true, 'Id de la station liée manquant, veuillez contactez un amdinistrateur']
  },
  user_id: {
    type: String,
    required: [true, 'Id de l\'utilisateur lié manquant, veuillez contactez un amdinistrateur']
  },
  date: {
    type: Date,
    required: [true, 'Date liée manquante, veuillez contactez un amdinistrateur']
  },
  value: {
    type: String
  },
  type: {
    type: String,
    enum: { values: statesEnum, message: 'Le type est inconnu' },
    required: [true, 'Type liée manquante, veuillez contactez un amdinistrateur']
  },
  id_old_data: {
    type: String,
    default: '-1'
  }
});

// RainDataAwaiting.index({ "station_id": 1, "date": 1 }, { "unique": true });
const RainDataAwaitingModel = mongoose.model("rainDataAwaiting", RainDataAwaiting);

// Export du modèle
exports.RainDataAwaitingModel = RainDataAwaitingModel;

/**
 * Méthode qui transforme un objet RainDataAwaiting vers un objet RainDatas
 * @param dataAwaiting Objet a Transformer
 * @returns {Model} RainData renvoyé.
 */
exports.RainDataAwaitinToAccepted = function(dataAwaiting) {
  let rainData = new rainDataModel();
  rainData.date = dataAwaiting.date;
  rainData.user_id = dataAwaiting.user_id;
  rainData.station_id = dataAwaiting.station_id;
  rainData.value = dataAwaiting.value;
  return rainData
}