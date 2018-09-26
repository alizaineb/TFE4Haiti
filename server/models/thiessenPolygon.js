var mongoose = require('mongoose');
var config = require('./../modules/config');

// schema pour l'affichage de la heathmap
var Schema = mongoose.Schema;
var ThiessenPolygon = new Schema({
  id_station: { type: String, required: true }
  // TODO : liste de points avec lat et long et du coup le meme schema dans station !!! points:{}
});


//Definition du modèle
var thiessenPolygonModel = mongoose.model(config.database.collections.thiessenPolygon, ThiessenPolygon);

// Export du modèle
exports.thiessenPolygonModel = thiessenPolygonModel;