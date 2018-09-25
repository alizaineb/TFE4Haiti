var mongoose = require('mongoose');
 
// schema pour récupérer un mot de passe
var Schema = mongoose.Schema;
var donnee = new Schema({
    id_station: { type: String, required: true},
	date: { type: Date, required: true},
	valeur: {type: Number, required: true, min:0}
});
 
 
//Definition du modèle
var donneeModele = mongoose.model(config.database.collections.data, donnee);
 
// Export du modèle
exports.donneeModele = donneeModele;