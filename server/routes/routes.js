'use strict';
// Roles de l'application
const roles = require('../config/constants').roles;
// Tous les controllers de l'application
let controllers = {};
controllers.data = require('../controllers/dataCtrl');
controllers.users = require('../controllers/userCtrl');
controllers.stations = require('../controllers/stationCtrl');
controllers.note = require('../controllers/noteCtrl');
controllers.rainData = require('../controllers/dataCtrl');

// MiddleWare permettant de vérifier qu'un utilisateur a accès à la station (pour effectuer des actions dessus (Update, delete, etc))
let hasAccesToStation = require('../controllers/utils').hasAccesToStation;

// API routes
/* Tableau reprenant toutes les routes
 * Exemple d'utilisation
 * {
 * path : Le chemin, commence  par /api/
 *        ensuite vient le domaine auquel la route va être liée (p. ex. user/)
 *        enfin l'obejectif de la route
 * httpMethod : GET,POST, DELETE, PUT. Toute autre méthode ne sera pas reconnue
 * middleWare : Middleware par lesquels la route doit passer, ceux-ci seront vérifié dans l'ordre dans lequel ils ont été énnoncés.
 *              Enfin, spécifier la méthode à laquelle la route est liée
 * access : Spécification des roles (si nécessaire), p. ex. [roles.NOM_DU_ROLE]
 * }
 */
exports.routes = [
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
    path: "/api/workers/",
    httpMethod: "GET",
    middleWare: [controllers.users.getWorkers]
  },
  {
    path: "/api/users/getAllAwaiting",
    httpMethod: "GET",
    middleWare: [controllers.users.getAllAwaiting],
    access: [roles.ADMIN]
  },
  {
    path: "/api/users/acceptUser/:user_id",
    httpMethod: "POST",
    middleWare: [controllers.users.acceptUser],
    access: [roles.ADMIN]
  },
  {
    path: "/api/users/refuse/:user_id",
    httpMethod: "POST",
    middleWare: [controllers.users.refuseUser],
    access: [roles.ADMIN]
  },
  {
    path: "/api/users/:user_id",
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
    path: "/api/users/:user_id",
    httpMethod: "GET",
    middleWare: [controllers.users.getById]
  },
  {
    path: "/api/users/:user_id",
    httpMethod: "PUT",
    middleWare: [controllers.users.update],
    access: [roles.ADMIN]
  },
  {
    path: "/api/users/getUsers",
    httpMethod: "GET",
    middleWare: [controllers.users.getUsers]
  },

  // Méthodes liées aux stations
  {
    path: "/api/stations/stats",
    httpMethod: "GET",
    middleWare: [controllers.stations.getStats]

  },
  { //      /api/stations/5bbdb51dd7aec61a195afc9b/import
    path: "/api/stations/:id/import",
    httpMethod: "POST",
    middleWare: [controllers.data.importManualData],
    access: [roles.WORKER, roles.ADMIN]

  },
  { //      /api/stations/5bbdb51dd7aec61a195afc9b/import
    path: "/api/stations/:id/download",
    httpMethod: "GET",
    middleWare: [controllers.data.downloadData],
    access: [roles.VIEWER, roles.WORKER, roles.ADMIN]

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
    path: "/api/stations/getInfo/bassin_versants",
    httpMethod: "GET",
    middleWare: [controllers.stations.getBassin_versants]
  },
  {
    path: "/api/stations",
    httpMethod: "POST",
    middleWare: [controllers.stations.create],
    access: [roles.ADMIN, roles.WORKER]
  },
  {
    path: "/api/stations",
    httpMethod: "GET",
    middleWare: [controllers.stations.get]
  },

  {
    path: "/api/stations/:station_id",
    httpMethod: "DELETE",
    middleWare: [controllers.stations.delete],
    access: [roles.ADMIN]
  },
  {
    path: "/api/stations/:station_id",
    httpMethod: "PUT",
    middleWare: [controllers.stations.update],
    access: [roles.ADMIN]
  },
  {
    path: "/api/stations/addUser/:station_id",
    httpMethod: "PUT",
    middleWare: [controllers.stations.addUser],
    access: [roles.ADMIN]
  },
  {
    path: "/api/stations/removeUser/:station_id",
    httpMethod: "PUT",
    middleWare: [controllers.stations.removeUser],
    access: [roles.ADMIN]
  },
  {
    path: "/api/stations/:station_id",
    httpMethod: "GET",
    middleWare: [controllers.stations.getById]
  },
  // Méthodes liées aux notes
  {
    path: "/api/notes",
    httpMethod: "POST",
    middleWare: [hasAccesToStation, controllers.note.create],
    access: [roles.ADMIN, roles.WORKER]
  },
  {
    path: "/api/notes/:station_id",
    httpMethod: "GET",
    middleWare: [controllers.note.get],
    access: [roles.ADMIN, roles.WORKER, roles.VIEWER]
  },

  // Méthodes liées aux data
    {
        path: "/api/rainData/stats",
        httpMethod: "GET",
        middleWare: [controllers.data.getStats]
    },
  {
    path: "/api/rainData/:station_id/updateData",
    httpMethod: "POST",
    middleWare: [hasAccesToStation, controllers.data.updateData],
    access: [roles.ADMIN, roles.WORKER]
  },
  {
    path: "/api/rainData/awaiting",
    httpMethod: "GET",
    middleWare: [controllers.data.getAwaiting],
    access: [roles.ADMIN]
  },
  {
    path: "/api/rainData/accept",
    httpMethod: "POST",
    middleWare: [controllers.data.acceptAwaiting],
    access: [roles.ADMIN]
  },
  {
    path: "/api/rainData/refuse/:id",
    httpMethod: "DELETE",
    middleWare: [controllers.data.refuseAwaiting],
    access: [roles.ADMIN]
  },
  {
    path: "/api/rainData/:stationId",
    httpMethod: "GET",
    middleWare: [controllers.data.get],
    access: [roles.ADMIN, roles.WORKER]
  },
  {
    path: "/api/rainDataGraphLineOneYear/:stationId/:year",
    httpMethod: "GET",
    middleWare: [controllers.data.getRainDataGraphLineOneYear],
  },
  {
    path: "/api/rainDataGraphLineOneMonth/:stationId/:month/:year",
    httpMethod: "GET",
    middleWare: [controllers.data.getRainDataGraphLineOneMonth],
  },
  {
    path: "/api/rainDataGraphLineRangeDate/:stationId/:minDate/:minMonth/:minYear/:maxDate/:maxMonth/:maxYear",
    httpMethod: "GET",
    middleWare: [controllers.data.rainDataGraphLineRangeDate],
  },


  {
    path: "/api/data/:stationId/:date",
    httpMethod: "GET",
    middleWare: [controllers.data.getForDay]
  },
  {
    path: "/api/data/:stationId/:year/:month",
    httpMethod: "GET",
    middleWare: [controllers.data.getForMonth]
  },

  // Routes utiilisées pour tester
  {
    path: "/api/login/test",
    httpMethod: "GET",
    middleWare: [controllers.users.useless],
    access: [roles.VIEWER, roles.WORKER, roles.ADMIN]
  },
  // Juste les admins doivent avoir accès à cette route
  {
    path: "/api/someSecureRouteAdminOnly",
    httpMethod: "GET",
    middleWare: [controllers.users.useless],
    access: [roles.ADMIN]
  },
  // Personne ne doit avoir accès à cette route
  {
    path: "/api/someSecureRouteNotAccessible",
    httpMethod: "GET",
    middleWare: [controllers.users.useless],
    access: ["no_one"]
  },

  //
];