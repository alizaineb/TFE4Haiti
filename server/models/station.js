const mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const states = require('../config/constants').stationState;


// TODO En attente de confirmation
exports.communes = ['Port-au-Prince', 'Carrefour','Delmas','Cap-Haïtien','Pétionville'];
exports.rivers = ['Grande Rivière du Nord', 'Haut-du-Cap','Limbé','Marion'];
exports.intervals = ['1min', '5min', '10min', '15min', '30min', '1h', '2h', '6h', '12h', '24h'];


// schema pour récupérer un mot de passe
const Schema = mongoose.Schema;
const Station = new Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true, min: -90.0, max: 90.0 },
  longitude: { type: Number, required: true, min: -180.0, max: 180.0 },
  altitude: { type: Number, min: 0, max: 10000 },
  //picture: { type: String }, // Url vers la photo
  users: { type: [String], required: true },
  user_creator_id: { type: String, required: true },
  createdAt: { type: Date, required: true },
  commune: { type: String, required: true, enum: this.communes },
  river: { type: String, required: true, enum: this.rivers },
  state: { type: String, enum: [states.AWAITING, states.BROKEN, states.WORKING, states.DELETED], required: true },
  interval: { type: String, required: true, enum: ['1min', '5min', '10min', '15min', '30min', '1h', '2h', '6h', '12h', '24h'] }
}, {
  //Ajoute le champ updatedAt automatiquement
  timestamps: { createdAt: false, updatedAt: true }
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
    river: this.river,
    commune: this.commune,
    user_creator_id: this.user_creator_id,
    users: this.users
  };
};

const stationModel = mongoose.model("station", Station);
exports.stationModel = stationModel;