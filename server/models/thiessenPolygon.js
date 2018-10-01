var mongoose = require('mongoose');

// schema pour l'affichage de la heathmap
var Schema = mongoose.Schema;
var ThiessenPolygon = new Schema({
  id_station: { type: String, required: true }
  // TODO : liste de points avec lat et long et du coup le meme schema dans station !!! points:{}
});


//Definition du modèle
var thiessenPolygonModel = mongoose.model("thiessenPolygon", ThiessenPolygon);

// Export du modèle
exports.thiessenPolygonModel = thiessenPolygonModel;