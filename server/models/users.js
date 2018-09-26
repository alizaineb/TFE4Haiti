var mongoose = require('mongoose');
var config = require('./../modules/config');

// schema d'un utilisateur
var Schema = mongoose.Schema;
var User = new Schema({
  mail: { type: String, required: true },
  mdp: { type: String, required: true },
  date_creation: { type: Date, default: Date.now },
  derniere_connexion: { type: Date, default: Date.now },
  type: { type: String, enum: ['admin', 'lamba'], required: true }
});


//Definition du modèle
var userModel = mongoose.model(config.database.collections.user, User);

// Export du modèle
exports.userModel = userModel;

// TODO Si jamais j'ai des méthodes pour hash le pwd etc etc