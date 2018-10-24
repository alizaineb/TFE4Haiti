const mongoose = require('mongoose');

// schema concernant les données pluviométriques
const Schema = mongoose.Schema;
const RainData = new Schema({
  id_station: { type: String, required: true },
  id_user: { type: String, required: true },
  date: { type: Date, required: true },
  value: { type: Number, required: true, min: 0 }
});


//Definition du modèle
const rainDataModel = mongoose.model("rainData", RainData);

// Export du modèle
exports.rainDataModel = rainDataModel;