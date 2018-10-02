// Tous les controllers de l'application
var tokenManager = require('../config/tokenManager');
var controllers = {};
controllers.users = require('../controllers/UserCtrl');
controllers.stations = require('../controllers/StationCtrl');
// Route par défaut récupère l'index
// controllers.angular = function(req, res) { res.sendFile(path.join(__dirname, '../public/index.html')); };

exports.routes = [
  // API routes
  /* Exemple
   * {
   * path : Le chemin, commence  par /api/
   *        ensuite vient le domaine auquel la route va être liée (p. ex. user/)
   *        enfin l'obejectif de la route
   * httpMethod : GET,POST, DELETE, PUT. Toute autre méthode ne sera pas reconnue
   * middleWare : C'est ici, que le token sera vérifié (si nécessaire) via l'ajout de [jwt({secret: secret})], tokenManager.verifyToken,
   *              Ensuite, spécifier la méthode à laquelle la route est liée
   * access : Spécification des roles (si nécessaire), p. ex. [1,2,3]
   * }
   */
  {
    path: "/api/user/login",
    httpMethod: "POST",
    middleWare: [controllers.users.login]
  },
  {
    path: "/api/user/logout",
    httpMethod: "GET",
    middleWare: [controllers.users.logout]
  },
  {
    path: "/api/user/create",
    httpMethod: "POST",
    middleWare: [controllers.users.create]
  },
  {
    path: "/api/user/get",
    httpMethod: "GET",
    middleWare: [controllers.users.get]
  },




  // Routes used to test
  {
    path: "/api/user/someSecureRouteAdminOnly",
    httpMethod: "GET",
    middleWare: [controllers.users.useless],
    access: ['admin']
  },
  {
    path: "/api/user/someSecureRouteNotAccessible",
    httpMethod: "GET",
    middleWare: [controllers.users.useless],
    access: ['NO_ONE']
  }
  //
];