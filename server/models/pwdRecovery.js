'use strict';
// Libraire node
const mongoose = require('mongoose');

// schema pour récupérer un mot de passe
const Schema = mongoose.Schema;
const PwdRecovery = new Schema({
  user_id: {
    type: String,
    required: [true, 'Utilisateur lié manquant, veuillez contactez un amdinistrateur']
  },
  url: {
    type: String,
    required: [true, 'Url lié manquant, veuillez contactez un amdinistrateur'],
    unique: [true, 'Veuillez réessayer'],
  },
  date: {
    type: Date,
    default: Date.now,
    required: [true, 'Date liée manquante, veuillez contactez un amdinistrateur']
  },
  duration: {
    type: Number,
    required: [true, 'Durée liée manquante, veuillez contactez un amdinistrateur']
  }
});


//Definition du modèle
const pwdRecoveryModel = mongoose.model("pwdRecovery", PwdRecovery);

// Export du modèle
exports.pwdRecoveryModel = pwdRecoveryModel;