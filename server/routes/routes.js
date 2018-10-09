// Tous les controllers de l'application
const roles = require('../config/constants').roles;
let controllers = {};
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


  // Méthodes liées aux utilisateurs
  {
    path: "/api/users/login",
    httpMethod: "POST",
    middleWare: [controllers.users.login]
  },
  {
    path: "/api/users/logout",
    httpMethod: "GET",
    middleWare: [controllers.users.logout]
  },
  {
    path: "/api/users/",
    httpMethod: "POST",
    middleWare: [controllers.users.create]
  },
  {
    path: "/api/users/",
    httpMethod: "GET",
    middleWare: [controllers.users.get]
  },
  {
    path: "/api/users/getAllAwaiting",
    httpMethod: "GET",
    middleWare: [controllers.users.getAllAwaiting]
    // access: [roles.ADMIN]
  },
  {
    path: "/api/users/acceptUser",
    httpMethod: "POST",
    middleWare: [controllers.users.acceptUser]
    // access: [roles.ADMIN]
  },
  {
    path: "/api/users/:id",
    httpMethod: "GET",
    middleWare: [controllers.users.getById]
  },
  {
    path: "/api/users/:id",
    httpMethod: "DELETE",
    middleWare: [controllers.users.delete]
  },


  // Méthodes liées aux stations
  {
    path: "/api/stations",
    httpMethod: "POST",
    middleWare: [controllers.stations.create],
      access: [roles.ADMIN]
  },
  {
    path: "/api/stations",
    httpMethod: "GET",
    middleWare: [controllers.stations.get]
  },
  {
    path: "/api/stations/:id",
    httpMethod: "GET",
    middleWare: [controllers.stations.getById]
  },
  {
    path: "/api/stations/:id",
    httpMethod: "DELETE",
    middleWare: [controllers.stations.delete]
  },
  {
    path: "/api/stations/:id",
    httpMethod: "PUT",
    middleWare: [controllers.stations.update]
  },







  // Routes used to test
  {
    path: "/api/someSecureRouteAdminOnly",
    httpMethod: "GET",
    middleWare: [controllers.users.useless],
    access: [roles.ADMIN]
  },
  {
    path: "/api/someSecureRouteNotAccessible",
    httpMethod: "GET",
    middleWare: [controllers.users.useless],
    access: ["no_one"]
  },

  //
];