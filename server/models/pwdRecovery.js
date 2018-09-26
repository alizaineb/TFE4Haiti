var mongoose = require('mongoose');
var config = require('./../modules/config');

// schema pour récupérer un mot de passe
var Schema = mongoose.Schema;
var PwdRecovery = new Schema({
  utilisateur: { type: String, required: true },
  url: { type: String, required: true },
  date_peremption: { type: Date, required: true }
});


//Definition du modèle
var PwdRecoverynModel = mongoose.model("pwdRecovery", PwdRecovery);

// Export du modèle
exports.PwdRecoverynModel = PwdRecoverynModel;