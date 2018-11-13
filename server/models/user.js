const mongoose = require('mongoose');
const nconf = require('nconf');
var bcrypt = require('bcryptjs');
const roles = require('../config/constants').roles;
const state = require('../config/constants').userState;
const StationModel = require('./../models/station');
var SALT_WORK_FACTOR = 4;

// schema d'un utilisateur
const Schema = mongoose.Schema;
const User = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  mail: { type: String, required: true, unique: true },
  pwd: { type: String },
  created_at: { type: Date, default: Date.now },
  commune: { type: String, enum: StationModel.communes },
  river: { type: String, enum: StationModel.rivers },
  last_seen: { type: Date, default: Date.now },
  role: { type: String, enum: [roles.ADMIN, roles.WORKER, roles.VIEWER], required: true },
  state: { type: String, enum: [state.AWAITING, state.PASSWORD_CREATION, state.OK, state.DELETED], required: true, default: state.AWAITING }
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