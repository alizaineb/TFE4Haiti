'use strict';
// Modules node
const nconf = require('nconf');
var crypto = require('crypto');

// Nos modules
const logger = require('../config/logger');
const UsersModel = require('./../models/users');
const tokenManager = require('./../config/tokenManager');
const roles = require('../config/constants').roles;
const userState = require('../config/constants').userState;
const checkParam = require('./utils').checkParam;
const mailTransporter = require('./mailer');
const PwdRecoveryModel = require('./../models/pwdRecovery');

exports.login = function(req, res) {
  checkParam(req, res, ["mail", "pwd"], function() {

    let mail = req.body.mail;
    let pwd = req.body.pwd;

    UsersModel.userModel.findOne({ mail: mail, state: userState.OK }, function(err, result) {
      if (err) {
        logger.error(err);
        return res.status(500).send("Impossible de créer cet utilisateur, veuillez contacter un administrateur.");
      }
      if (!result) {
        return res.status(404).send("Login et/ou mot de passe incorrect.");
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
              logger.error(err);
              return res.status(500).send("Impossible de créer un token");
            }
          } else {
            return res.status(404).send("Login et/ou mot de passe incorrect.");
          }
        });
      }
    }).catch(function(err) {
      logger.error(err);
      return res.status(500).send("Erreur lors de la récupération de l'utilisateur.");
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
    return res.status(500).send("Erreur lors de la récupération des utilisateurs");
  })
};

exports.getById = function(req, res) {
  let _id = req.params.id;
  UsersModel.userModel.findById({ _id: _id }, function(err, user) {
    if (err) return res.status(500).send("Erreur lors de la récupération de l'user.");
    if (user.length > 1) return res.status(500).send("Ceci n'aurait jamais dû arriver.");
    if (user.length === 0) return res.status(404).send("L'utilisateur n'existe pas");

    return res.status(200).send(user.toDto());
  });
};

exports.getByEmail = function(req, res) {
  //TODO connect to mongodb
  return res.status(200).send("Method to implements");

};

exports.create = function(req, res) {
  // TODO Check mail
  checkParam(req, res, ["first_name", "last_name", "mail"], () => {

    let uTmp = new UsersModel.userModel();
    let user = req.body;
    uTmp.first_name = user.first_name;
    uTmp.last_name = user.last_name;
    uTmp.mail = user.mail;
    uTmp.role = roles.ADMIN; //TODO Change to VIEWER, it's admin for the developpement
    uTmp.state = userState.AWAITING;
    uTmp.save().then(() => {
      return res.status(201).send(uTmp.toDto());
    }).catch(function(err) {
      logger.error(err);
      return res.status(500).send("Une erreur est survenue lors de la création de l'utilisateur");
    });
  });
};

exports.update = function(req, res) {
  // TODO Check mail
  checkParam(req, res, ["_id", "first_name", "last_name", "mail", "role", "state"], () => {
    let id = req.body._id;
    UsersModel.userModel.findById({ _id: id }, function(err, user) {
      if (err) {
        logger.error(err);
        return res.status(500).send("Erreur lors de la récupération de l'user.");
      } else {
        user.first_name = req.body.first_name;
        user.last_name = req.body.last_name;
        user.role = req.body.role;
        user.state = req.body.state;
        user.save((err) => {
          if (err) {
            logger.error(err);
            return res.status(500).send("Une erreur est survenue lors de la mise à jour de l'utilisateur");
          } else {
            return res.status(200).send();
          }
        });
      }
    });
  });
}

exports.delete = function(req, res) {
  checkParam(req, res, ["id"], () => {
    let id = req.params.id;
    // console.log(id);
    let user = UsersModel.userModel.deleteOne({ _id: id }).then(() => {
      return res.status(204).send("ok") //TODO remove body
    }).catch(function(err) {
      logger.error(err);
      return res.status(500).send("Erreur lors de la suppression de l'utilisateur");
    });
  });
};

exports.logout = function(req, res) {
  //TODO connect to mongodb
  return res.status(200).send("Method to implements");
};

exports.getAllAwaiting = function(req, res) {
  UsersModel.userModel.find({ state: userState.AWAITING }, function(err, result) {
    if (err) {
      logger.error(err);
      return res.status(500).send("Erreur lors de la récupération des utilisateurs en attente.");
    }
    if (!result) {
      return res.status(204);
    } else {
      let tabS = [];
      result.forEach(user => tabS.push(user.toDto()));
      return res.status(200).send(tabS);
    }
  });
}

exports.acceptUser = function(req, res) {
  checkParam(req, res, ["id"], () => {
    let id = req.body.id;
    UsersModel.userModel.find({ _id: id, state: userState.AWAITING }, function(err, result) {
      if (err) {
        logger.error(err);
        return res.status(500).send("Erreur lors de la récupération de l'utilisateur concerné.");
      }
      if (result.length > 1) {
        return res.status(500).send("Ceci n'aurait jamais dû arriver.");
      } else if (result.length == 0) {
        return res.status(404).send("Aucun utilisateur correspondant.");
      } else {
        let currUser = result[0];
        sendEmailReset(req, res, currUser, false);
      }
    });
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
        logger.error(err);
        return res.status(500).send("Erreur lors de la récupération de l'utilisateur concerné.");
      }

      if (result.length > 1) {
        return res.status(500).send("Ceci n'aurait jamais dû arriver.");
      } else if (result.length == 0) {
        return res.status(404).send("Aucun utilisateur correspondant.");
      } else {
        // Lui envoyer un mail
        let currUser = result[0];
        let text = 'Bonjour ' + currUser.first_name + ' ' + currUser.last_name +
          ',\n\nVotre demande de compte a été refusée.\nRaison :  \n"' +
          ((reason.trim().length > 0) ? reason : 'Pas de raison donnée par l\'administrateur') +
          '"\n\nLes informations vont concernant sont supprimées.\n\nBien à vous';
        mailTransporter.sendMailAndIgnoreIfMailInvalid(req, res, nconf.get('mail').subjectCreationAccRefused, currUser.mail, text, (resp) => {
          // Le supprimer de la db
          currUser.remove(function(err, userUpdt) {
            if (err) {
              return res.status(500).send("Erreur lors de la suppression de l'utilisateur concerné.");
            }
            return res.status(200).send();
          });
        });
      }
    });
  });
}


exports.askResetPwd = function(req, res) {
  checkParam(req, res, ["mail"], () => {
    // Trouver l'utilisateur concerné
    UsersModel.userModel.find({ mail: req.body.mail }, function(err, result) {
      if (err) {
        logger.error(err);
        return res.status(500).send("Erreur lors de la récupération de l'utilisateur concerné.");
      }

      if (result.length > 1) {
        return res.status(500).send("Ceci n'aurait jamais dû arriver.");
      } else if (result.length == 0) {
        // /!\ Est bien un retour 200 pour des raisons de sécurité on ne peut pas renvoyer une 404, sinon il devient possible de brute forcer la liste des utilisateurs /!\
        return res.status(200).send();
      } else {
        let currUser = result[0];
        // /!\ Pas signifier à l'utilisateur si son compte a été validé
        if (currUser.state == userState.AWAITING || currUser.state == userState.DELETED) {
          return res.status(200).send();
        }
        sendEmailReset(req, res, currUser, true);
      }
    });
  });
}

exports.resetPwd = function(req, res) {
  checkParam(req, res, ["pwd1", "pwd2", "urlReset"], () => {
    let pwd1 = req.body.pwd1;
    let pwd2 = req.body.pwd2;
    let url = req.body.urlReset;

    // check mdp1 == mdp2
    if (pwd1 != pwd2) {
      return res.status(400).send("Mot de passe différents");
    }
    PwdRecoveryModel.pwdRecoveryModel.find({ url: url }, (err, result) => {
      if (err) {
        logger.error(err);
        return res.status(500).send("Erreur lors de la récupération du lien de reset concerné.");
      }
      if (result.length > 1) {
        return res.status(500).send("Ceci n'aurait jamais dû arriver.");
      } else if (result.length == 0) {
        return res.status(400).send("Lien inexistant ou déjà utilisé.");
      } else {
        let urlObj = result[0];
        UsersModel.userModel.find({ _id: urlObj.user }, function(err, result) {
          if (err) {
            logger.error(err);
            return res.status(500).send("Erreur lors de la récupération de l'utilisateur concerné.");
          }
          if (result.length > 1) {
            return res.status(500).send("Ceci n'aurait jamais dû arriver.");
          } else if (result.length == 0) {
            // /!\ Est bien un retour 200 pour des raisons de sécurité on ne peut pas renvoyer une 404, sinon il devient possible de brute forcer la liste des liesn de reset /!\
            return res.status(500).send("Utilisateur supprimé entre temps");
          } else {
            // check user en mode pwd_creation
            let usr = result[0];
            if (usr.state != userState.PASSWORD_CREATION) {
              return res.status(500).send("L'utilisateur n'est pas dans l'état requis");
            } else {
              // Check pas expiré
              var date = new Date();
              if (date.getTime() < (urlObj.date.getTime() + (urlObj.duration * 1000))) {
                usr.pwd = pwd1;
                usr.state = userState.OK;
                usr.save((err) => {
                  if (err) {
                    logger.error(err);
                    return res.status(500).send("Une erreur est survenue lors de la mise à jour du mot de passe");
                  } else {
                    urlObj.remove(function(err, userUpdt) {
                      if (err) {
                        logger.error(err);
                        return res.status(500).send("Erreur lors de la suppression du lien d'utlisation");
                      }
                      return res.status(200).send();
                    });
                  }
                });
              } else {
                return res.status(400).send("Malheureusement vous avez mis trop de temps pour changer votre mot de passe, le lien utilisé est écoulé.");
              }
            }
          }

        });
      }
    });
  });
}



// Private function
function getRandomString() {
  crypto.randomBytes(64, function(ex, buf) {
    if (ex) throw ex; //TODO La traiter ???
    return buf.toString('hex');
  });
}

function sendEmailReset(req, res, user, isUserRequest) {
  // Création de l'objet permettant de reset le mdp
  let pwdTmp = new PwdRecoveryModel.pwdRecoveryModel();
  let url = crypto.randomBytes(32).toString('hex');
  let origin = req.get('origin');
  pwdTmp.user = user._id;
  pwdTmp.url = url
  if (isUserRequest) {
    pwdTmp.duration = nconf.get("user").changePwdTime;
  } else {
    pwdTmp.duration = nconf.get("user").accountAcceptedTime;
  }
  let urlTotal = origin + '/login/reset/' + (isUserRequest ? 'u' : 'a') + '/' + url;
  pwdTmp.save((err) => {
    if (err) {
      logger.error(err);
      return res.status(500).send("Une erreur est survenue lors de la création de l'url de reset");
    }
    // On envoie le mail
    let text = 'Bonjour ' + user.first_name + ' ' + user.last_name +
      ',\n\nVoici le lien avec lequel vous avez la possibilité de ' + (isUserRequest ? 'changer' : 'créer') +
      ' votre mot de passe : \n' +
      urlTotal +
      (isUserRequest ? '\n\nSi vous n\'avez pas effectué cette requête, veuillez contacter l\'administrateur' : '') +
      '\n\n Bien à vous';
    let title = "";

    if (isUserRequest) {
      title = nconf.get('mail').changePwd;
    } else {
      title = nconf.get('mail').subjectCreationAccOk;
    }
    mailTransporter.sendMail(req, res, title, user.mail, text, () => {
      user.state = userState.PASSWORD_CREATION;
      // On met à jour l'utilisateur
      user.save(function(err, userUpdt) {
        if (err) {
          logger.error(err);
          return res.status(500).send("Erreur lors de la mise à jour de l'utilisateur concerné.");
        }
        return res.status(200).send();
      });
    });

  });
}



// used to tetst some routes
exports.useless = function(req, res) {
  return res.status(200).send("ok");
};