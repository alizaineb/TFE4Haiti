'use strict';
// Modules node
const nconf = require('nconf');

// Nos modules
const logger = require('../config/logger');
const UsersModel = require('./../models/users');
const tokenManager = require('./../config/tokenManager');
const roles = require('../config/constants').roles;
const userState = require('../config/constants').userState;
const checkParam = require('./utils').checkParam;
const mailTransporter = require('./mailer').transporter;

exports.login = function(req, res) {
  checkParam(req, res, ["mail", "pwd"], function() {

    let mail = req.body.mail;
    let pwd = req.body.pwd;

    UsersModel.userModel.findOne({ mail: mail, state: userState.OK }, function(err, result) {
      if (err) {
        return res.status(500).send({ error: "Impossible de créer cet utilisateur, veuillez contacter un administrateur." });
      }
      if (!result) {
        return res.status(404).send({ error: "Login et/ou mot de passe incorrect." });
      } else {
        result.comparePassword(pwd, function(match) {
          if (match === true) {
            var token = tokenManager.createToken(result);
            // console.log(token);
            if (token) {
              return res.json({
                token: token,
                current: result.toDto()
              });
            } else {
              const err = "the server was unable to create a token.";
              logger.error(err);
              return res.status(500, err);
            }
          } else {
            return res.status(404).send({ error: "Login et/ou mot de passe incorrect." });
          }
        });
      }
    }).catch(function(err) {
      logger.error(err);
      return res.status(500).send(err);
    });
  });
};

exports.get = function(req, res) {
  UsersModel.userModel.find({}).then(function(users) {
    let tabU = [];
    users.forEach(user => tabU.push(user.toDto()));
    return res.status(200).send(tabU);
  }).catch(function(err) {
    logger.error(err);
    return res.status(500).send(err);
  })
};

exports.getById = function(req, res) {
  //TODO connect to mongodb
  return res.status(200).send({ message: "Method to implements" });
};

exports.getByEmail = function(req, res) {
  //TODO connect to mongodb
  return res.status(200).send({ message: "Method to implements" });

};

exports.create = function(req, res) {
  // TODO Check mail
  let uTmp = new UsersModel.userModel();
  let user = req.body
  uTmp.first_name = user.first_name;
  uTmp.last_name = user.last_name;
  uTmp.mail = user.mail;
  uTmp.pwd = user.pwd;
  uTmp.role = roles.ADMIN; //TODO Change to VIEWER, it's admin for the developpement
  uTmp.state = userState.AWAITING;
  uTmp.save().then(() => {
    return res.status(201).send({ message: uTmp.toDto() });
  }).catch(function(err) {
    logger.error(err);
    return res.status(500).send(err);
  })
};

exports.update = function(req, res) {
  //TODO connect to mongodb
  return res.status(200).send({ message: "Method to implements" });
};

exports.delete = function(req, res) {
  let id = req.params.id;
  // console.log(id);
  let user = UsersModel.userModel.deleteOne({ _id: id }).then(() => {
    return res.status(204).send({ deleted: "ok" }) //TODO remove body
  }).catch(function(err) {
    logger.error(err);
    return res.status(500).send(err);
  });
};

exports.logout = function(req, res) {
  //TODO connect to mongodb
  return res.status(200).send({ message: "Method to implements" });
};

exports.getAllAwaiting = function(req, res) {
  UsersModel.userModel.find({ state: userState.AWAITING }, function(err, result) {
    if (err) {
      return res.status(500).send({ error: "Erreur lors de la récupération des utilisateurs en attente." });
    }
    if (!result) {
      return res.status(204);
    } else {
      let tabS = [];
      result.forEach(user => tabS.push(user.toDto()));
      return res.status(200).send(tabS);
      return res.status(200).send();
    }
  });
}

exports.acceptUser = function(req, res) {
  let id = req.body.id || '';
  if (!id) {
    return res.status(400).send("Information manquante");
  }

  UsersModel.userModel.find({ _id: id, state: userState.AWAITING }, function(err, result) {
    if (err) {
      return res.status(500).send({ error: "Erreur lors de la récupération de l'utilisateur concerné." });
    }

    if (result.length > 1) {
      return res.status(500).send({ error: "Ceci n'aurait jamais dû arriver." });
    } else if (result.length == 0) {
      return res.status(404).send({ error: "Aucun utilisateur correspondant." });
    } else {
      let currUser = result[0];
      var mailOptions = {
        from: nconf.get('mail').user,
        to: currUser.mail,
        subject: nconf.get('mail').subjectCreationAccOk,
        text: 'This is a test'
      };
      mailTransporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).send({ error: "Erreur lors de l'envoi du mail à l'utilisateur." });
        } else {
          currUser.state = userState.PASSWORD_CREATION;
          currUser.save(function(err, userUpdt) {
            if (err) {
              return res.status(500).send({ error: "Erreur lors de la mise à jour de l'utilisateur concerné." });
            }
            return res.status(200).send();
          });
        }
      });
    }
  });
}

exports.refuseUser = function(req, res) {
  checkParam(req, res, ["id"], () => {
    // Récupérer l'utilisateur
    if (req.body.reason == undefined) {
      return res.status(400).send("Information manquante");
    }
    let id = req.body.id;
    let reason = req.body.reason;
    UsersModel.userModel.find({ _id: id, state: userState.AWAITING }, function(err, result) {
      if (err) {
        return res.status(500).send({ error: "Erreur lors de la récupération de l'utilisateur concerné." });
      }

      if (result.length > 1) {
        return res.status(500).send({ error: "Ceci n'aurait jamais dû arriver." });
      } else if (result.length == 0) {
        return res.status(404).send({ error: "Aucun utilisateur correspondant." });
      } else {
        // Lui envoyer un mail
        let currUser = result[0];
        let text = 'Bonjour ' + currUser.first_name + ' ' + currUser.last_name + ',\n\nVotre demande de compte a été refusée.\nRaison :  \n"' + ((reason.trim().length > 0) ? reason : 'Pas de raison donnée par l\'administrateur') + '"\n\nLes informations vont concernant sont supprimées.\n\nBien à vous';
        console.log(text);
        var mailOptions = {
          from: nconf.get('mail').user,
          to: currUser.mail,
          subject: nconf.get('mail').subjectCreationAccRefused,
          text: text
        };
        mailTransporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res.status(500).send({ error: "Erreur lors de l'envoi du mail à l'utilisateur." });
          } else {
            // Le supprimer de la db
            currUser.remove(function(err, userUpdt) {
              if (err) {
                return res.status(500).send({ error: "Erreur lors de la suppression de l'utilisateur concerné." });
              }
              return res.status(200).send();
            });
          }
        });
      }
    });
  });
}






exports.useless = function(req, res) {
  return res.sendStatus(200, { message: "ok", error: "NON" });
};