const mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');


// schema pour récupérer un mot de passe
const Schema = mongoose.Schema;
const Station = new Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true, min: -90, max: 90 },
  longitude: { type: Number, required: true, min: -180, max: 180 },
  type: { type: String, enum: ['hydro', 'limni'], required: true },
  //picture: { type: String }, // Url vers la photo
  users: { type: [String], required: true },
  state: { type: String, enum: ['attente', 'panne', "valide"], required: true }
});

Station.methods.toDto = function() {
  return {
    _id: this._id,
    name: this.name,
    latitude: this.latitude,
    longitude: this.longitude,
    type: this.type,
    state: this.state,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

Station.plugin(timestamps);
//Definition du modèle
const stationModel = mongoose.model("station", Station);
// Export du modèle
exports.stationModel = stationModel;