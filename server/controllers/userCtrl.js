'use strict';
/**
 * Controlleur reprenant toutes les méthodes liées aux utilisateurs
 */
// Modules node
const nconf = require('nconf');
var crypto = require('crypto');

// Nos modules
const logger = require('../config/logger');
// Modèles
const UsersModel = require('../models/user');
const StationModel = require('./../models/station');
const PwdRecoveryModel = require('./../models/pwdRecovery');
// Gestion du token
const tokenManager = require('./../config/tokenManager');
// états
const roles = require('../config/constants').roles;
const userState = require('../config/constants').userState;
const checkParam = require('./utils').checkParam;
const errors = require('./utils').errors;
// gestion des mails
const mailTransporter = require('./mailer');



/**
 * login - Permet à une utilisateur de se connecter à l'application
 *
 * @param {request} req Requête du client
 * @param {string} req.body.mail Le mail de la personne souhaitant se connecter
 * @param {string} req.body.pwd Le password le parsonne souhaitant se connecter
 * @param {response} res Réponse renvoyée au client
 *                   404 : Login et ou mot de passe inconnu (Ne pas dire lequel des deux pour des raisons de sécurité)
 *                   500 : Erreur serveur
 * @return {json}    201 : un token validé par le tokenManager et l'utilisateur lié /!\ sans le sont mot de passe
 */
exports.login = function(req, res) {
  let mail = req.body.mail;
  let pwd = req.body.pwd;

  // Récupération d'un utilisateur dont l'état est OK
  UsersModel.userModel.findOne({ mail: mail, state: userState.OK },
    '_id first_name last_name mail role river commune created_at last_seen state pwd',
    (err, result) => {
      if (err) {
        logger.error("[userCtrl] get1 : ", err);
        return res.status(500).send("Erreur lors de la récupération de l'utilisateur.");
      }
      if (!result) {
        return res.status(404).send("Login et/ou mot de passe incorrect.");
      } else {
        // /!\ Pourrait ne pas matcher si l'utilisateur a été créée en avec la configuration "development" a été changée
        result.comparePassword(pwd, function(match) {
          if (match === true) {
            var token = tokenManager.createToken(result);
            if (token) {
              let date = new Date(Date.now());
              result.last_seen = date;
              result.save((err) => {
                if (err) {
                  logger.error("[userCtrl] get3 : ", err);
                  return res.status(500).send("Erreur lors de la mise à jour de sa date de dernière connexion.");
                }
                // Retirer le mot de passe envoyé au client !
                result.pwd = undefined;
                return res.status(201).send({
                  token: token,
                  current: result
                });
              });
            } else {
              logger.error("[userCtrl] get2 : ", err);
              return res.status(500).send("Impossible de créer un token");
            }
          } else {
            return res.status(404).send("Login et/ou mot de passe incorrect.");
          }
        });
      }
    });
};


/**
 * get - Récupère tous les utilisateurs
 *
 * @param {request} req Requête du client
 * @param {response} res Réponse renvoyée au client
 *                   500 : Erreur serveur
 * @return {user[]}  200 : Tous les utilisateurs
 */
exports.get = function(req, res) {
  UsersModel.userModel.find({},
    '_id first_name last_name mail role river commune created_at last_seen state',
    (err, users) => {
      if (err) {
        logger.error("[get] get : ", err);
        return res.status(500).send("Erreur lors de la récupération des utilisateurs.");
      }
      return res.status(200).send(users);
    });
};


/**
 * getById - Récupère un itlisateur spécifique
 *
 * @param {request} req Requête du client
 * @param {string} req.params.user_id L'id de l'utilsateur devant être trouvé
 * @param {response} res Réponse renvoyée au client
 *                   404 : L'utilisateur n'existe pas
 *                   500 : Erreur serveur
 * @return {user[]}  200 : Tous les utilisateurs
 */
exports.getById = function(req, res) {
  let id = req.params.user_id;
  UsersModel.userModel.findById(req.params.user_id,
    '_id first_name last_name mail role river commune created_at last_seen state',
    function(err, user) {
      if (err) {
        return res.status(500).send("Erreur lors de la récupération de l'user.");
      }
      if (!user) {
        return res.status(404).send("L'utilisateur n'existe pas");
      }
      return res.status(200).send(user);
    });
};

/**
 * roles - Permet de récupérer toutes les rôles des utilisateurs
 *
 * @param {request} req Requête du client
 * @param {response} res Réponse renvoyée au client
 * @return {string[]}     200 : les roles possible pour un utilisateur
 */
exports.roles = function(req, res) {
  return res.status(200).send(Object.values(roles));
};


/**
 * create - Permet de créer un utilisateur en le mettant en état d'attente de confirmation par l'administrateur
 *
 * @param {request} req Requête du client
 * @param {string} req.body.first_name Le prénom de l'utilisateur
 * @param {string} req.body.last_name Le nom de l'utilisateur
 * @param {string} req.body.mail Le mail de l'utilisateur
 * @param {string} req.body.role Le role de l'utilisateur (ENUM)
 * @param {string} req.body.commune Le role de l'utilisateur (ENUM) (optionnel)
 * @param {string} req.body.river Le role de l'utilisateur (ENUM) (optionnel)
 * @param {response} res Réponse renvoyée au client
 * @return {station}     201 : l'utilisateur ajouté en base de données
 */
exports.create = function(req, res) {
  let user = req.body;
  let uTmp = new UsersModel.userModel();
  uTmp.first_name = user.first_name;
  uTmp.last_name = user.last_name;
  uTmp.mail = user.mail;
  uTmp.role = user.role;
  uTmp.state = userState.AWAITING;
  if (user.role == roles.WORKER) {
    uTmp.commune = user.commune;
    uTmp.river = user.bassin_versant;
  }
  uTmp.save((err) => {
    if (err) {
      logger.error("[userCtrl] create :", err);
      let tmp = errors(err);
      return res.status(tmp.error).send(tmp.message);
    }
    // Retirer le mot de passe envoyé au client !
    uTmp.pwd = undefined;
    return res.status(201).send(uTmp);
  });
};


/**
 * update - Permet de mettre à jour un utilsiateur, il est possible de spécifier uniquement le champ à mettre à jour, dans ce cas, nous allons utiliser les anciens champs
 *
 * @param {request} req Requête du client
 * @param {string} req.params_user_id L'id de l'utilisateur à mettre à jour
 * @param {string} req.body.first_name Le prénom de l'utilisateur à mettre à jour
 * @param {string} req.body.mail Le mail de l'utilisateur à mettre à jour
 * @param {string} req.body.last_name Le nom de l'utilisateur à mettre à jour
 * @param {string} req.body.role Le role de l'utilisateur à mettre à jour
 * @param {string} req.body.state L'état de l'utilisateur à mettre à jour
 * @param {string} req.body.commune La commune de l'utilisateur à mettre à jour
 * @param {string} req.body.river Le bassin-versant de l'utilisateur à mettre à jour
 * @param {response} res Réponse renvoyée au client
 *                       400 : Donnée erronnée
 *                       404 : Utilisateur inexistant
 *                       500 : Erreur serveur
 * @return {station}     201 : l'utilisateur mis à jour
 */
exports.update = function(req, res) {
  UsersModel.userModel.findById(req.params.user_id,
    '_id first_name last_name mail role river commune created_at last_seen state',
    (err, user) => {
      if (err) {
        logger.error(err);
        return res.status(500).send("Erreur lors de la récupération de l'utilisateur.");
      } else if (!user) {
        return res.status(404).send("L'utilisateur n'existe pas");
      } else {
        user.first_name = req.body.first_name || user.first_name;
        user.mail = req.body.mail || user.mail;
        user.last_name = req.body.last_name || user.last_name;
        user.role = req.body.role || user.role;
        user.state = req.body.state || user.state;
        if (!req.body.commune) {
          user.commune = undefined;
        } else {
          user.commune = req.body.commune;
        }
        if (!req.body.river) {
          user.river = undefined;
        } else {
          user.river = req.body.river;
        }
        user.save((err) => {
          if (err) {
            logger.error(err);
            let tmp = errors(err);
            return res.status(tmp.error).send(tmp.message);
          } else {
            return res.status(201).send(user);
          }
        });
      }
    });
}


/**
 * delete - Permet de passer l'état de l'utilisateur à delete.
 *          Etant donné le besoin de garder les données liées à l'utilisateur, nous ne pouvons pas supprimer celui-ci de la base de données
 *
 * @param {request} req Requête du client
 * @param {string} req.params.user_id L'id de l'utilisateur à mettre à jour
 * @param {response} res Réponse renvoyée au client
 *                       404 : Utilisateur inexistant
 *                       500 : Erreur serveur
 * @return {station}     201 : l'utilisateur mis à jour dont l'état est passé à deleted
 */
exports.delete = function(req, res) {
  let user = UsersModel.userModel.findById(req.params.user_id,
    'state',
    (err, user) => {
      if (err) {
        logger.error("[userCtrl] delete1 :", err);
        let tmp = errors(err);
        return res.status(tmp.error).send(tmp.message);
      } else if (!user) {
        return res.status(404).send("L'utilisateur n'existe pas");
      }
      user.state = userState.DELETED;
      user.save(function(err) {
        if (err) {
          logger.error("[userCtrl] delete2 :", err);
          let tmp = errors(err);
          return res.status(tmp.error).send(tmp.message);
        }
        return res.status(201).send(user);
      });
    });
};

// TODO ?????
exports.logout = function(req, res) {
  //TODO connect to mongodb
  return res.status(200).send("Method to implements");
};

/**
 * getAllAwaiting - Permet de récupérer tous les utilisateurs en attente
 *                  Va récupérer les champs suivants : _id first_name last_name mail role river commune created_at last_seen state
 *
 * @param {request} req Requête du client
 * @param {response} res Réponse renvoyée au client
 *                       500 : Erreur serveur
 * @return {string[]}    200 : Les stations dont l'état est en attente
 */

exports.getAllAwaiting = function(req, res) {
  UsersModel.userModel.find({ state: userState.AWAITING },
    '_id first_name last_name mail role river commune created_at last_seen state',
    (err, users) => {
      if (err) {
        logger.error("[userCtrl] getAllAwaiting :", err);
        return res.status(500).send("Erreur lors de la récupération des utilisateurs en attente.");
      }
      return res.status(200).send(users);
    });
}
/**
 * acceptUser - Permet de passer un utilisateur de l'état awaiting à l'état ok, va envoyer à l'utilisateur un mail
 *
 * @param {request}   req Requête du client
 * @param {string}    req.body.user_id L'id de l'utilisateur à accepter
 * @param {response}  res Réponse renvoyée au client
 *                        500 : Erreur serveur
 * @return                200
 */
exports.acceptUser = function(req, res) {
  UsersModel.userModel.findOne({ _id: req.params.user_id, state: userState.AWAITING }, function(err, result) {
    if (err) {
      logger.error("[userCtrl] acceptUser :", err);
      return res.status(500).send("Erreur lors de la récupération de l'utilisateur concerné.");
    }
    if (!result) {
      return res.status(404).send("Utilisateur introuvable (peut-être a-t-il déjà été accepté).");
    } else {
      let currUser = result;
      sendEmailReset(req, res, currUser, false);
    }
  });
}


/**
 * refuseUser - Permet de refuser un utilisateur en lui en envoyant un mail.
 *              Si l'email ne s'envoie pas, cela va saimplement l'ignorer et supprimer l'utilisateur de la base de données.
 *
 * @param {request} req Requête du client
 * @param {request} req.params.user_id L'id de l'utilisateur à refuser
 * @param {request} req.body.reason La raison donnée par l'administateur, si celle-ci n'est pas présente nous enverrons un mail spécifiant qu'aucune raison n'a été donnée (optionnel)
 * @param {response} res Réponse renvoyée au client
 *                       400 : Si il manque la raison
 *                       404 : Si l'utilisateur n'existe pas
 *                       500 : Erreur serveur
 * @return               200
 */
exports.refuseUser = function(req, res) {
  let reason = req.body.reason;
  UsersModel.userModel.findOne({ _id: req.params.user_id, state: userState.AWAITING }, function(err, user) {
    if (err) {
      logger.error("[userCtrl] refuseUser1 :", err);
      return res.status(500).send("Erreur lors de la récupération de l'utilisateur concerné.");
    } else if (!user) {
      return res.status(404).send("Utilisateur introuvable (peut-être a-t-il déjà été refusé).");
    } else {
      // Lui envoyer un mail
      let text = `Bonjour  ${user.first_name} ${user.last_name},\n\n
        Votre demande de compte a été refusée.\n
        ${((reason) ? ("Raison : \"" + reason+"\"") : "Pas de raison donnée par l\'administrateur")}
        \n\nLes informations vont concernant sont supprimées.\n\nBien à vous`;
      // Envoyer un mail et ignorer si celui-ci ne c'est pas envoyé
      mailTransporter.sendMailAndIgnoreIfMailInvalid(req, res, nconf.get('mail').subjectCreationAccRefused, user.mail, text, (resp) => {
        // Le supprimer de la db
        user.remove(function(err, userUpdt) {
          if (err) {
            logger.error("[userCtrl] refuseUse2 :", err);
            return res.status(500).send("Erreur lors de la suppression de l'utilisateur concerné.");
          }
          return res.status(200).send();
        });
      });
    }
  });
}


/**
 * askResetPwd - Utilisée lorsqu'un utilisateur a oublié son mot de passe et fait la demande pour changer de mot de passe
 *               Cette méthode va envoyer un mail à l'utilisateur avec le lien permettant de changer de mot de passe
 *
 * @param {request} req Requête du client
 * @param {request} req.body.reason Le mail de la personne
 * @param {response} res Réponse renvoyée au client
 *                       400 : Si il manque le mail
 *                       500 : Erreur serveur
 * @return               Fait appel à la fonction sendEmailReset
 */
exports.askResetPwd = function(req, res) {
  let mail = req.body.mail;
  if (!mail) {
    return res.status(400).send("Veuillez fournir votre mail.");
  }
  // ne vérifier que pour les utilisateurs dont l'état est à OK
  UsersModel.userModel.findOne({ mail: req.body.mail, state: userState.OK }, function(err, user) {
    if (err) {
      logger.error("[userCtrl] askResetPwd1 :", err);
      return res.status(500).send("Erreur lors de la récupération de l'utilisateur concerné.");
    } else if (!user) {
      // Pour pas dire que l'utilsateur existe pas
      return res.status(200).send();
    } else {
      sendEmailReset(req, res, user, true);
    }
  });
}


/**
 * resetPwd - Permet de changer de mot de passe, va comprarer les deux mots de passe envoyé et vérifier que l'url envoyé existe.
 *            Si tout est conforme et que le temps n'est pas expiré, va changer le mot de passe de l'utilisateur.
 *
 * @param {request} req Requête du client
 * @param {request} req.body.pwd1 Le premier champ du mot de passe
 * @param {request} req.body.pwd2 Le deuxième champ du mot de passe
 * @param {request} req.body.urlReset L'url par laquelle l'utilisateur est tombé sur le mot de passe
 * @param {response} res Réponse renvoyée au client
 *                       400 : Si il manque un champ ou que pwd1 est différent de pwd2
 *                       404 : Url inexistante
 *                       500 : Erreur serveur
 * @return               200
 */
exports.resetPwd = function(req, res) {
  if (!req.body.pwd1 || !req.body.pwd2 || !req.body.urlReset) {
    return res.status(400).send("Il manque un ou plusieurs champ(s).");
  }
  let pwd1 = req.body.pwd1;
  let pwd2 = req.body.pwd2;
  let url = req.body.urlReset;
  // check mdp1 == mdp2
  if (pwd1 != pwd2) {
    return res.status(400).send("Mot de passe différents");
  }
  PwdRecoveryModel.pwdRecoveryModel.findOne({ url: url }, (err, result) => {
    if (err) {
      logger.error("[userCtrl] resetPwd1 :", err);
      return res.status(500).send("Erreur lors de la récupération du lien de reset concerné.");
    } else if (!result) {
      // Ne rien dire si pas lien inexistant (Sécurité);
      return res.status(200).send();
    } else {
      let urlObj = result;
      UsersModel.userModel.findOne({ _id: urlObj.user, state: userState.PASSWORD_CREATION }, function(err, user) {
        if (err) {
          logger.error("[userCtrl] resetPwd2:", err);
          return res.status(500).send("Erreur lors de la récupération de l'utilisateur concerné.");
        } else if (!user) {
          // Ne rien dire si pas d'utilsateur (Sécurité);
          return res.status(200).send();
        } else {
          // Check pas expiré
          var date = new Date();
          if (date.getTime() < (urlObj.date.getTime() + (urlObj.duration * 1000))) {
            user.pwd = pwd1;
            user.state = userState.OK;
            user.save((err) => {
              if (err) {
                logger.error("[userCtrl] resetPwd3:", err);
                return res.status(500).send("Une erreur est survenue lors de la mise à jour du mot de passe");
              } else {
                urlObj.remove(function(err, userUpdt) {
                  if (err) {
                    logger.error("[userCtrl] resetPwd4:", err);
                    return res.status(500).send("Erreur lors de la suppression du lien d'utlisation");
                  }
                  return res.status(200).send();
                });
              }
            });
          }
          // Expiré : retirer l'objet de la DB
          else {
            urlObj.remove(function(err, userUpdt) {
              if (err) {
                logger.error("[userCtrl] resetPwd4:", err);
                return res.status(500).send("Erreur lors de la suppression du lien d'utlisation");
              }
              return res.status(400).send("Malheureusement vous avez mis trop de temps pour changer votre mot de passe, le lien utilisé est écoulé.");
            });
          }
        }
      });
    }
  });
}

/**
 * sendEmailReset - Va envoyer un mail lutilisateur permettant de changer/initialiser son mot de passe
 *
 * @param {request} req Requête du client
 * @param {response} res Réponse renvoyée au client
 *                       500 : Erreur serveur
 * @param  {user} user L'utilisateur à qui il faut envoyer un mot de passe
 * @param  {boolean} isUserRequest Signifie s'il s'agit d'une demande effectuée par l'utilisateur ou bien s'il s'agit d'une demande effectuée suite à l'acceptation du l'utilisateur par un administrateur
 * @return              200
 */
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
      logger.error("[userCtrl] sendEmailReset1 :", err);
      // L'erreur peut peut-être provenir de l'url qui existe déjà (unique dans le modèles)
      return res.status(500).send("Une erreur est survenue lors de la création de l'url de reset, veuillez réessayer. Si l'erreur persiste, veuillez ocntacter un administrateur");
    }
    // Texte du mail
    let text = 'Bonjour ' + user.first_name + ' ' + user.last_name +
      ',\n\nVoici le lien avec lequel vous avez la possibilité de ' + (isUserRequest ? 'changer' : 'créer') +
      ' votre mot de passe : \n' +
      urlTotal +
      (isUserRequest ? '\n\nSi vous n\'avez pas effectué cette requête, veuillez contacter l\'administrateur' : '') +
      '\n\n Bien à vous';

    // Titre du mail
    let title = "";
    if (isUserRequest) {
      title = nconf.get('mail').changePwd;
    } else {
      title = nconf.get('mail').subjectCreationAccOk;
    }
    // Envoi de l'email
    mailTransporter.sendMail(req, res, title, user.mail, text, () => {
      user.state = userState.PASSWORD_CREATION;
      // On met à jour l'utilisateur
      user.save((err, userUpdt) => {
        if (err) {
          logger.error("[userCtrl] sendEmailReset2 :", err);
          return res.status(500).send("Erreur lors de la mise à jour de l'utilisateur concerné.");
        }
        return res.status(200).send();
      });
    });

  });
}
// used to test some routes
exports.useless = function(req, res) {
  return res.status(200).send({ message: 'ok' });
};