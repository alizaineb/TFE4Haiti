
const mongoose = require('mongoose');
const state = require('../config/constants').DataType;

// schema concernant les données pluviométriques
const Schema = mongoose.Schema;
const RainData = new Schema({
  id_station: { type: String, required: true },
  id_user: { type: String, required: true },
  date: { type: Date, required: true },
  value: { type: Number, required: true, min: 0 }
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
    new Date(data.date).valueOf(),
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
  id_station: { type: String, required: true },
  id_user: { type: String, required: true },
  date: { type: Date, required: true },
  value: { type: Number, required: true, min: 0 },
  type: {type: String, enum: [state.FILE, state.INDIVIDUAL, state.UPDATE], required: true },
  id_old_data: {type: String, default: '-1'}
});

RainDataAwaiting.index({ "id_station": 1, "date": 1 }, { "unique": true });
const RainDataAwaitingModel = mongoose.model("rainDataAwaiting", RainDataAwaiting);

// Export du modèle
exports.RainDataAwaitingModel = RainDataAwaitingModel;

exports.RainDataAwaitinToAccepted = function(dataAwaiting){
  let rainData = new rainDataModel();
  rainData.date = dataAwaiting.date;
  rainData.id_user = dataAwaiting.id_user;
  rainData.id_station = dataAwaiting.id_station;
  rainData.value = dataAwaiting.value;
  return rainData
}