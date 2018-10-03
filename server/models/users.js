var mongoose = require('mongoose');
const enums = require('./enum');
// schema d'un utilisateur
var Schema = mongoose.Schema;
var User = new Schema({
  mail: { type: String, required: true },
  pwd: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  last_seen: { type: Date, default: Date.now },
  type: { type: String, enum: [enums.roles.ADMIN, enums.roles.WORKER, enums.roles.VIEWER], required: true }
});

User.methods.toDto = function() {
  return {
    _id: this._id,
    mail: this.mail,
    type: this.type,
    created_at: this.created_at,
    last_seen: this.last_seen
  };
};


//Definition du modèle
var userModel = mongoose.model("user", User);

// Export du modèle
exports.userModel = userModel;

// TODO Si jamais j'ai des méthodes pour hash le pwd etc etc