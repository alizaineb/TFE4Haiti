'use strict';
// Libraire node
const mongoose = require('mongoose');
// Etats
const states = require('../config/constants').stationState;

let statesEnum = [states.AWAITING, states.BROKEN, states.WORKING, states.DELETED];

let communes = [
  'Port-au-Prince',
  'Carrefour',
  'Delmas',
  'Cap-Haïtien',
  'Pétionville',
  'Les Gonaïves',
  'Saint-Marc',
  'Les Cayes',
  'Verretes',
  'Port-de-Paix',
  'Jacmel',
  'Limbé',
  'Jérémie',
  'Petite-Rivière-de-l\'Artibonite',
  'Hinche',
  'Petit-Goâve',
  'Desdunes',
  'Dessalines',
  'Saint-Louis-du-Nord',
  'Saint-Michel-de-l\'Attalaye',
  'Léogâne',
  'Fort-Liberté',
  'Trou-du-Nord',
  'Ouanaminthe',
  'Mirebalais',
  'Grande-Rivière-du-Nord',
  'Lascahobas',
  'Anse-d\'Ainault',
  'Gros-Morne',
  'Anse-à-Galets',
  'Pignon',
  'Croix-des-Bouquets',
  'Dame-Marie',
  'Miragoâne',
  'Saint-Raphael',
  'Aquin',
  'Kenscoff'
];

let bassin_versants = ['bassin_versant1', 'bassin_versant2', 'Grande Rivière du Nord', 'Haut-du-Cap', 'Limbé', 'Marion'];
let intervals = ['1min', '5min', '10min', '15min', '30min', '1h', '2h', '6h', '12h', '24h'];
const Schema = mongoose.Schema;
const Station = new Schema({
  name: {
    type: String,
    required: [true, 'Veuillez fournir une nom pour cette station']
  },
  latitude: {
    type: Number,
    required: [true, 'Veuillez fournir une latitude'],
    min: [-90.0, 'La latitude doit être supérieure à -90'],
    max: [90.0, 'La latitude doit être inférieure à 90']
  },
  longitude: {
    type: Number,
    required: [true, 'Veuillez fournir une longitutde'],
    min: [-180.0, 'La longitude doit être supérieure à -180'],
    max: [180.0, 'La longitude doit être inférieure à 180']
  },
  altitude: {
    type: Number,
    min: [0, 'L\'altitude doit être supérieure à 0'],
    max: [10000, 'L\'altitude doit être inférieure à 10000']
  },
  //picture: { type: String }, // Url vers la photo
  users: {
    type: [String],
    required: [true, 'Impossible de créer la liste d\'utilisateur, veuillez contactez un amdinistrateur']
  },
  user_creator_id: {
    type: String,
    required: [true, 'Impossible de récuperer le créateur de la station, veuillez réessayer plus tard']
  },
  createdAt: {
    type: Date,
    required: [true, 'Veuillez fournir une date de création'],
    validate: {
      validator: function(v) {
        const d = new Date();
        return v.getFullYear() <= d.getFullYear() && v.getMonth() <= d.getMonth() && v.getDate() <= d.getDate();
      },
      message: props => `Vous ne pouvez pas créer une station dans le futur`
    }
  },
  updatedAt: {
    type: Date,
    required: [true, 'Impossible de créer la date de dernière mise à jour, veuillez contactez un amdinistrateur']
  },
  commune: {
    type: String,
    required: [true, 'Veuillez spécifier la commune'],
    enum: { values: communes, message: 'Commune inconnue' }
  },
  bassin_versant: {
    type: String,
    required: [true, 'Veuillez spécifier le bassin versant'],
    enum: { values: bassin_versants, message: 'Bassin versant inconnu' }
  },
  state: {
    type: String,
    enum: { values: statesEnum, message: 'Etat inconnu' },
    required: [true, 'Veuillez fournir un état pour la station']
  },
  interval: {
    type: String,
    required: [true, 'Veuillez fournir un intervalle pour la station'],
    enum: { values: intervals, message: 'Intervalle inconnu' }
  }
});


// Avant qu'une station ne soit mise à jour, changer sa date de dernière mise à jour
Station.pre('save', function() {
  const d = new Date();
  this.updatedAt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()));
});

Station.methods.toDto = function() {
  return {
    _id: this._id,
    name: this.name,
    latitude: this.latitude,
    longitude: this.longitude,
    altitude: this.altitude,
    state: this.state,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    interval: this.interval,
    bassin_versant: this.bassin_versant,
    commune: this.commune,
    user_creator_id: this.user_creator_id,
    users: this.users
  };
};


//Definition du modèle
const stationModel = mongoose.model("station", Station);
// Export du modèle
exports.stationModel = stationModel;

// Exports des contantes
// TODO Mettre dans le fichier de constantes ?
exports.bassin_versants = bassin_versants;
exports.intervals = intervals;
exports.communes = communes;