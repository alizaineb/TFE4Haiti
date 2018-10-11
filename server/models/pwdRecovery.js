const mongoose = require('mongoose');

// schema pour récupérer un mot de passe
const Schema = mongoose.Schema;
const PwdRecovery = new Schema({
  user: { type: String, required: true },
  url: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
  duration: { type: Number, required: true }
});


//Definition du modèle
const pwdRecoveryModel = mongoose.model("pwdRecovery", PwdRecovery);

// Export du modèle
exports.pwdRecoveryModel = pwdRecoveryModel;