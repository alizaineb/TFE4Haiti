const mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const states = require('../config/constants').stationState;


// schema pour récupérer un mot de passe
const Schema = mongoose.Schema;
const Station = new Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true, min: -90.0, max: 90.0 },
  longitude: { type: Number, required: true, min: -180.0, max: 180.0 },
  altitude: {type: Number, required: true},
  //picture: { type: String }, // Url vers la photo
  users: { type: [String], required: true },
  createdAt: { type: Date, required: true},
  state: { type: String, enum: [states.AWAITING, states.BROKEN, states.WORKING, states.DELETED], required: true },
  interval: {type: String, required: true, enum: ['1min','5min','10min','15min','30min','1h','2h','6h','12h','24h']}
},{
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
    interval: this.interval
  };
};

//Definition du modèle
const stationModel = mongoose.model("station", Station);
// Export du modèle
exports.stationModel = stationModel;