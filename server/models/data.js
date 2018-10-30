const mongoose = require('mongoose');

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

RainData.statics.toDtoGraphLine = function toDtoGraphLine (data) {
  return [
    new Date(data.date).valueOf(),
    data.value
  ]
};

//Definition du modèle
const rainDataModel = mongoose.model("rainData", RainData);

// Export du modèle
exports.rainDataModel = rainDataModel;


