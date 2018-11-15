const mongoose = require('mongoose');
const nconf = require('nconf');
var bcrypt = require('bcryptjs');
const roles = require('../config/constants').roles;
const state = require('../config/constants').userState;
const StationModel = require('./../models/station');
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
    default: Date.now
  },
  commune: {
    type: String,
    enum: { values: StationModel.communes, message: 'Commune inconnue' }
  },
  river: {
    type: String,
    enum: { values: StationModel.rivers, message: 'Bassin versant inconnu' }
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

User.methods.toDto = function() {
  return {
    _id: this._id,
    first_name: this.first_name,
    last_name: this.last_name,
    mail: this.mail,
    role: this.role,
    river: this.river,
    commune: this.commune,
    created_at: this.created_at,
    last_seen: this.last_seen,
    state: this.state
  };
};

// Bcrypt middleware on UserSchema
User.pre('save', function(next) {
  if (!nconf.get('development')) {
    var user = this;
    if (!user.isModified('pwd')) return next();

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

//Password verification
User.methods.comparePassword = function(password, cb) {
  if (nconf.get('development')) {
    cb(this.pwd == password);
  } else {
    bcrypt.compare(password, this.pwd, function(err, isMatch) {
      if (err) {
        return cb(err);
      }
      cb(isMatch);
    });
  }
};


//Definition du modèle
const userModel = mongoose.model("user", User);

// Export du modèle
exports.userModel = userModel;