var mongoose = require('mongoose');
 
// schema pour récupérer un mot de passe
var Schema = mongoose.Schema;
var recupPwd = new Schema({
    utilisateur: { type: String, required: true},
	url: { type: String, required: true},
	date_peremption: {type: Date, required: true}
});
 
 
//Definition du modèle
var recupPwdModele = mongoose.modele('recupPwd', recupPwd);
 
// Export du modèle
exports.recupPwdModele = recupPwdModele;