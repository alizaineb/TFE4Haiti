// Modules node
const _ = require('underscore');

// Nos modules
const routesJs = require('./routes');
const routes = routesJs.routes;
const tokenManager = require('./../config/tokenManager');
const db = require("./../models/users");

// Applique les middleWare de vérification de sécurité
//  redirige selon le type de méthode
// Vérifie que le type de méthode existe (GET,POST, ...)
module.exports = function(app) {
  _.each(routes, function(route) {
    // Si la route contient des accès, il faut la vérifier
    if (route.access) {
      route.middleWare.unshift(ensureAuthorized);
      route.middleWare.unshift(tokenManager.validateToken);
    }
    let args = _.flatten([route.path, route.middleWare]);

    // ToUpperCase au pour s'assurer que si qqun écrit get ça soit correct (GET normalement)
    switch (route.httpMethod.toUpperCase()) {
      case 'GET':
        app.get.apply(app, args);
        break;
      case 'POST':
        app.post.apply(app, args);
        break;
      case 'PUT':
        app.put.apply(app, args);
        break;
      case 'DELETE':
        app.delete.apply(app, args);
        break;
      default:
        throw new Error('Type de requête inconnue pour la route ' + route.path);
    }
  });
}

function ensureAuthorized(req, res, next) {
  let token = req.token_decoded;
  if (token && token.id) {
    // Check le droit de l'utiliasteur en le gettant dans la db (son id est dans le token)
    db.userModel.findOne({ _id: token.id }, function(err, user) {
      // Compare sa la personne a accès à la route, si non res.sendStatus(403);
      if (user) {
        let access = _.findWhere(routes, {
          path: req.route.path,
          httpMethod: req.route.stack[0].method.toUpperCase()
        }).access;
        if (access.indexOf(user.type) > -1) {
          return next();
        } else {
          return res.sendStatus(403, "Non autorisé");
        }
      } else {
        // j'ai remplacé la 403 ici par une 401 parce que je pense que si l'utilisateur n'est pas connu,
        // ca veut dire que la personne n'est pas connecter et pas que sont role ne donne pas accès

        return res.sendStatus(401, "Utilisateur inconnu");
      }
    });
  }
  // Si l'utilisateur n'a pas de token
  else {
    let access = _.findWhere(routes, {
      path: req.route.path,
      httpMethod: req.route.stack[0].method.toUpperCase()
    }).access;
    if (!access) {
      return next();
    } else {
      return res.sendStatus(401, "Token manquant");
    }
  }
}