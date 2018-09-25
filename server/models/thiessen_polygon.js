var mongoose = require('mongoose');
 
// schema pour récupérer un mot de passe
var Schema = mongoose.Schema;
var thiessenPolygone = new Schema({
	id_station:{type:String, required:true}
	// TODO : liste de points avec lat et long et du coup le meme schema dans station !!! points:{}
});
 
 
//Definition du modèle
var thiessenPolygoneModele = mongoose.model(config.database.collections.thiessenPolygon, thiessenPolygone);
 
// Export du modèle
exports.thiessenPolygoneModele = thiessenPolygoneModele;