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
    required: [true, 'La note ne peut pas être vide']
  }
}, {
  //Ajoute le champ createdAt et updatedAt automatiquement
  timestamps: { createdAt: true, updatedAt: true }
});

//Definition du modèle
const noteModel = mongoose.model("note", Note);
// Export du modèle
exports.noteModel = noteModel;