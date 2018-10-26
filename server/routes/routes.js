// Tous les controllers de l'application
const roles = require('../config/constants').roles;
let controllers = {};
controllers.data = require('../controllers/dataCtrl');
controllers.users = require('../controllers/UserCtrl');
controllers.stations = require('../controllers/StationCtrl');
controllers.note = require('../controllers/noteCtrl');
controllers.rainData = require('../controllers/dataCtrl');
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
    path: "/api/users/roles",
    httpMethod: "GET",
    middleWare: [controllers.users.roles]
  },
  {
    path: "/api/users/setDeleted",
    httpMethod: "POST",
    middleWare: [controllers.users.setDeleted],
    access: [roles.ADMIN]
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
    middleWare: [controllers.users.getAllAwaiting],
    access: [roles.ADMIN]
  },
  {
    path: "/api/users/acceptUser",
    httpMethod: "POST",
    middleWare: [controllers.users.acceptUser],
    access: [roles.ADMIN]
  },
  {
    path: "/api/users/refuse",
    httpMethod: "POST",
    middleWare: [controllers.users.refuseUser],
    access: [roles.ADMIN]
  },

  {
    path: "/api/users/:id",
    httpMethod: "DELETE",
    middleWare: [controllers.users.delete],
    access: [roles.ADMIN]
  },
  {
    path: "/api/users/askResetPwd",
    httpMethod: "POST",
    middleWare: [controllers.users.askResetPwd]
  },
  {
    path: "/api/users/resetPwd",
    httpMethod: "POST",
    middleWare: [controllers.users.resetPwd]
  },
  {
    path: "/api/users/:id",
    httpMethod: "GET",
    middleWare: [controllers.users.getById]
  },
  {
    path: "/api/users/:id",
    httpMethod: "PUT",
    middleWare: [controllers.users.update]
  },


  // Méthodes liées aux stations

  { //      /api/stations/5bbdb51dd7aec61a195afc9b/import
    path: "/api/stations/:id/import",
    httpMethod: "POST",
    middleWare: [controllers.data.importManualData],
    access: [roles.WORKER, roles.ADMIN]

  },
  { //      /api/stations/5bbdb51dd7aec61a195afc9b/import
    path: "/api/stations/:id/importFile",
    httpMethod: "POST",
    middleWare: [controllers.data.importFileData],
    access: [roles.WORKER, roles.ADMIN]

  },
  {
    path: "/api/stations/getAllAwaiting",
    httpMethod: "GET",
    middleWare: [controllers.stations.getAllAwaiting],
    access: [roles.ADMIN]
  },
  {
    path: "/api/stations/acceptStation",
    httpMethod: "POST",
    middleWare: [controllers.stations.acceptStation],
    access: [roles.ADMIN]
  },
  {
    path: "/api/stations/getInfo/intervals",
    httpMethod: "GET",
    middleWare: [controllers.stations.getIntervals]
  },
  {
    path: "/api/stations/getInfo/communes",
    httpMethod: "GET",
    middleWare: [controllers.stations.getCommunes]
  },
  {
    path: "/api/stations/getInfo/rivers",
    httpMethod: "GET",
    middleWare: [controllers.stations.getRivers]
  },
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
    httpMethod: "DELETE",
    middleWare: [controllers.stations.delete],
    access: [roles.ADMIN]
  },
  {
    path: "/api/stations/:id",
    httpMethod: "PUT",
    middleWare: [controllers.stations.update],
    access: [roles.ADMIN]
  },
  {
    path: "/api/stations/addUser/:id",
    httpMethod: "PUT",
    middleWare: [controllers.stations.addUser],
    access: [roles.ADMIN]
  },
  {
    path: "/api/stations/removeUser/:id",
    httpMethod: "PUT",
    middleWare: [controllers.stations.removeUser],
    access: [roles.ADMIN]
  },
  {
    path: "/api/stations/:id",
    httpMethod: "GET",
    middleWare: [controllers.stations.getById]
  },
  // Méthodes liées aux notes
  {
    path: "/api/notes",
    httpMethod: "POST",
    middleWare: [controllers.note.create],
    access: [roles.ADMIN, roles.WORKER]
  },
  {
    path: "/api/notes/:stationId",
    httpMethod: "GET",
    middleWare: [controllers.note.get],
    access: [roles.ADMIN, roles.WORKER]
  },

  // Méthodes liées aux data
  {
    path: "/api/data/:stationId",
    httpMethod: "GET",
    middleWare: [controllers.data.get],
    access: [roles.ADMIN, roles.WORKER]
  },


  {
    path: "/api/data/:stationId/:date",
    httpMethod: "GET",
    middleWare: [controllers.data.getForDay]
  },


  // Routes used to test
  {
    path: "/api/login/test",
    httpMethod: "GET",
    middleWare: [controllers.users.useless],
    access: [roles.VIEWER, roles.WORKER, roles.ADMIN]
  },
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