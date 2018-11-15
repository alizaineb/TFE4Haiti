const mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');


// schema pour récupérer un mot de passe
const Schema = mongoose.Schema;
const Note = new Schema({
  station_id: {
    type: String,
    required: [true, 'Id de la station liée manquant, veuillez contactez un amdinistrateur']
  },
  user_id: {
    type: String,
    required: [true, 'Utilisateur lié manquant, veuillez contactez un amdinistrateur']
  },
  note: {
    type: String,
    required: [true, 'La note ne pas être vide']
  }
}, {
  //Ajoute le champ createdAt et updatedAt automatiquement
  timestamps: { createdAt: true, updatedAt: true }
});

Note.methods.toDto = function() {
  return {
    _id: this._id,
    station_id: this.station_id,
    user_id: this.user_id,
    note: this.note,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

//Definition du modèle
const noteModel = mongoose.model("note", Note);
// Export du modèle
exports.noteModel = noteModel;