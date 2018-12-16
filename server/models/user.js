'use strict';
// Libraire node
const mongoose = require('mongoose');
const nconf = require('nconf');
var bcrypt = require('bcryptjs');
// Est-on en dévelopemment
const isInDev = nconf.get('development');
// Roles
const roles = require('../config/constants').roles;
// Etats
const state = require('../config/constants').userState;

// Modele des stations utilisé pour récupérer les communes et les bassins versants
const StationModel = require('./../models/station');

// Complexité du hachage
var SALT_WORK_FACTOR = 4;

let statesEnum = [state.AWAITING, state.PASSWORD_CREATION, state.OK, state.DELETED];
let rolesEnum = [roles.ADMIN, roles.WORKER, roles.VIEWER];
// schema d'un utilisateur
const Schema = mongoose.Schema;
const User = new Schema({
  first_name: {
    type: String,
    required: [true, 'Veuillez fournir un prénom']
  },
  last_name: {
    type: String,
    required: [true, 'Veuillez fournir un nom']
  },
  mail: {
    type: String,
    required: [true, 'Veuillez fournir un email'],
    unique: [true, 'Veuillez fournir un email'],
    validate: {
      validator: function(v) {
        // Source :  https://www.w3resource.com/javascript/form/email-validation.php
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `Format du mail "${props.value}" invalide`
    },
  },
  pwd: {
    type: String
  },
  created_at: {
    type: Date,
    required: [true, 'Veuillez spécifier une date de création, veuillez contactez un amdinistrateur']
  },
  commune: {
    type: String,
    enum: { values: StationModel.communes, message: 'Commune inconnue' }
  },
  bassin_versant: {
    type: String,
    enum: { values: StationModel.bassin_versants, message: 'Bassin versant inconnu' }
  },
  last_seen: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: { values: rolesEnum, message: 'Role demandé inconnu' },
    required: [true, 'Veuillez spécifier un role']
  },
  state: {
    type: String,
    enum: { values: statesEnum, message: 'Etat inconnu' },
    required: [true, 'Veuillez spécifier un état, veuillez contactez un amdinistrateur'],
    default: state.AWAITING
  }
});

// Avant qu'un utilisateur ne soit mis à jour, hacher son mot de passe si néccessaire
User.pre('save', function(next) {
  if (!isInDev) {
    var user = this;
    if (!user.isModified('pwd')) {
      return next();
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.pwd, salt, function(err, hash) {
        if (err) {
          return next(err);
        }
        user.pwd = hash;
        next();
      });
    });
  } else {
    next();
  }
});


/**
 * hashPassword - Va permettre de hasher un mot de passe (basé sur la libraire bcrypt)
 *
 * @param  {string} password le mot de passe à hasher
 * @param  {user} this L'utilisateur courrant
 * @param  {callback} callback la méthode à appeller après
 * @return {calback(boolean)}  Va faire appel au callback avec un erreur ,si une erreur s'est produite
 */
User.methods.hashPassword = function(password, callback) {
  //    var user = this;
  //    console.log(user);
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return callback(err);
    }
    bcrypt.hash(password, salt, function(err, hash) {
      if (err) {
        return callback(err);
      }

      callback(null, hash);
    });
  });
}

/**
 * comparePassword - Va permettre de comparer deux mot de passe
 *
 * @param  {string} password le mot de passe à comparer
 * @param  {user} this L'utilisateur courrant
 * @param  {callback} callback la méthode à appeller après
 * @return {calback(boolean)}  Va faire appel au callback avec un erreur ,si une erreur s'est produite
 */
User.methods.comparePassword = function(password, cb) {
  /// Si pas de mot de passe
  if (!password) {
    return cb(false);
  }
  if (isInDev) {
    return cb(this.pwd == password);
  } else {
    bcrypt.compare(password, this.pwd, function(err, isMatch) {
      if (err) {
        return cb(err);
      }
      return cb(isMatch);
    });
  }
};


//Definition du modèle
const userModel = mongoose.model("user", User);

// Export du modèle
exports.userModel = userModel;