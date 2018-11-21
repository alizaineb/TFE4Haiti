'use strict';
// Libraire node
const mongoose = require('mongoose');
// Etats
const state = require('../config/constants').DataType;

let statesEnum = [state.FILE, state.INDIVIDUAL, state.UPDATE];
// schema concernant les données pluviométriques
const Schema = mongoose.Schema;
const RainData = new Schema({
  id_station: {
    type: String,
    required: [true, 'Id de la station liée manquant, veuillez contactez un amdinistrateur']
  },
  id_user: {
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

RainData.methods.toDto = function() {
  return {
    _id: this._id,
    id_station: this.id_station,
    id_user: this.id_user,
    date: this.date,
    value: this.value
  };
};

RainData.statics.toDtoGraphLine = function toDtoGraphLine(data) {
  return [
    data.date.valueOf(),
    data.value
  ]
};

//Definition du modèle
RainData.index({ "id_station": 1, "date": 1 }, { "unique": true });
const rainDataModel = mongoose.model("rainData", RainData);

// Export du modèle
exports.rainDataModel = rainDataModel;



// awaiting

const RainDataAwaiting = new Schema({
  id_station: {
    type: String,
    required: [true, 'Id de la station liée manquant, veuillez contactez un amdinistrateur']
  },
  id_user: {
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

// RainDataAwaiting.index({ "id_station": 1, "date": 1 }, { "unique": true });
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
  rainData.id_user = dataAwaiting.id_user;
  rainData.id_station = dataAwaiting.id_station;
  rainData.value = dataAwaiting.value;
  return rainData
}