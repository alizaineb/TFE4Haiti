const mongoose = require('mongoose');
const nconf = require('nconf');
var bcrypt = require('bcryptjs');
const roles = require('../config/constants').roles;
var SALT_WORK_FACTOR = 4;

// schema d'un utilisateur
const Schema = mongoose.Schema;
const User = new Schema({
  mail: { type: String, required: true, unique: true },
  pwd: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  last_seen: { type: Date, default: Date.now },
  type: { type: String, enum: [roles.ADMIN, roles.WORKER, roles.VIEWER], required: true }
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

// Bcrypt middleware on UserSchema
User.pre('save', function(next) {
  if (!nconf.get('development')) {
    var user = this;
    if (!user.isModified('pwd')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) {
        log.error(err);
        return next(err);
      }
      bcrypt.hash(user.pwd, salt, function(err, hash) {
        if (err) {
          log.error(err);
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
      log.error(err);
      return callback(err);
    }
    bcrypt.hash(password, salt, function(err, hash) {
      if (err) {
        log.error(err);
        return callback(err);
      }

      callback(null, hash);
    });
  });
}

//Password verification
User.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.pwd, function(err, isMatch) {
    if (err) {
      log.error(err);
      return cb(err);
    }
    cb(isMatch);
  });
};


//Definition du modèle
const userModel = mongoose.model("user", User);

// Export du modèle
exports.userModel = userModel;

// TODO Si jamais j'ai des méthodes pour hash le pwd etc etc