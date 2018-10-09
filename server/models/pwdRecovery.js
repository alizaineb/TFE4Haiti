const mongoose = require('mongoose');

// schema pour récupérer un mot de passe
const Schema = mongoose.Schema;
const PwdRecovery = new Schema({
  user: { type: String, required: true },
  url: { type: String, required: true },
  expire: { type: Date, required: true }
});


//Definition du modèle
const PwdRecoverynModel = mongoose.model("pwdRecovery", PwdRecovery);

// Export du modèle
exports.PwdRecoverynModel = PwdRecoverynModel;