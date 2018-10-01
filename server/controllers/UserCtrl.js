'use strict';
var logger = require('../modules/logger');
var UsersModel = require('./../models/users');
const jwt = require('../modules/token');

exports.login = function(req, res) {
  console.log("OK");
  res.sendStatus(200);
  /*UsersModel.userModel.findOne({ mail: user.mail, pwd: user.pwd }, function(err, result) {
    if (err) {
      res.status(404).send({ error: err });
      return;
    }
    if (!result) {
      res.status(404).send({ error: "Login et/ou mot de passe incorrect." })

    } else {
      var token = jwt.createToken(result);
      if (!token) {
        res.status(200).send({ current: result.toDto(), token: token });
      } else {
        const err = "the server was unable to create a token.";
        logger.error(err);
        res.status(500).send(err);
      }
    }
  }).catch(function(err) {
    logger.error(err);
    res.status(500).send(err);
  });*/
}

exports.get = function(req, res) {
  UsersModel.userModel.find({}).then(function(users) {
    let tabU = [];
    users.forEach(user => tabU.push(user.toDto()));
    res.status(200).send({ message: tabU });
  }).catch(function(err) {
    logger.error(err);
    res.status(500).send(err);
  })
}
exports.getById = function(req, res) {
  //TODO connect to mongodb
  res.status(200).send({ message: "Method to implements" });
}

exports.getByEmail = function(req, res) {
  //TODO connect to mongodb
  res.status(200).send({ message: "Method to implements" });

}

exports.create = function(req, res) {
  let uTmp = new UsersModel.userModel();
  let user = req.body
  uTmp.mail = user.mail;
  uTmp.pwd = user.pwd;
  uTmp.type = user.type;
  uTmp.save().then(() => {
    return res.status(200).send({ message: uTmp.toDto() });
  }).catch(function(err) {
    logger.error(err);
    return res.status(500).send(err);
  })
}

exports.update = function(req, res) {
  //TODO connect to mongodb
  res.status(200).send({ message: "Method to implements" });
}

exports.delete = function(req, res) {
  //TODO connect to mongodb
  res.status(200).send({ message: "Method to implements" });
}

exports.logout = function(req, res) {
  //TODO connect to mongodb
  res.status(200).send({ message: "Method to implements" });
}