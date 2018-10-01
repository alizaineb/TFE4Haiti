var mongoose = require('mongoose');

// schema concernant les données pluviométriques
var Schema = mongoose.Schema;
var RainData = new Schema({
  id_station: { type: String, required: true },
  date: { type: Date, required: true },
  value: { type: Number, required: true, min: 0 }
});


//Definition du modèle
var rainDataModel = mongoose.model("rainData", RainData);

// Export du modèle
exports.rainDataModel = rainDataModel;