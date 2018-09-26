var mongoose = require('mongoose');
var config = require('./../modules/config');
 
// schema pour récupérer un mot de passe
var Schema = mongoose.Schema;
var station = new Schema({
    nom: { type: String, required: true},
	latitude: { type: Number, required: true, min:-90, max: 90},
	longitude: { type: Number, required: true, min:-180, max: 180},
	type: { type: String, enum:['hydro','limni'], required: true},
	date_creation: {type: Date, required: true, default: Date.now},
	derniere_utilisation: {type: Date},
	photo: {type:String}, // Url vers la photo
	utilisateurs: {type: [String], required: true},
	etat: {type: String, enum: ['attente','panne'], required: true}
});
 
 
//Definition du modèle
var stationModele = mongoose.model(config.database.collections.station, station);
 
// Export du modèle
exports.stationModele = stationModele;