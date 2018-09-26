var mongoose = require('mongoose');
var config = require('./../modules/config');

// schema pour récupérer un mot de passe
var Schema = mongoose.Schema;
var PwdRecuperation = new Schema({
  utilisateur: { type: String, required: true },
  url: { type: String, required: true },
  date_peremption: { type: Date, required: true }
});


//Definition du modèle
var pwdRecuperationModel = mongoose.model(config.database.collections.pwdRecovery, PwdRecuperation);

// Export du modèle
exports.pwdRecuperationModel = pwdRecuperationModel;