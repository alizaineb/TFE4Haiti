const logger = require('../config/logger');
const rainData = require('./../models/rainData');
const checkParam = require('./utils').checkParam;

/*
 * Méthode utilisée pour insérer des données en base de donnée
 * @param {number[]} dates Tableau des données devant être inséérer en base de données
 * @param {Station} station Station pour laquelle il faut insérer les données
 * @param {string} user L'id de l'utilisateur ayant inséré les données
 * ? Besoin d'un autre paramètre ?
 */
exports.insertData = function(req, res, datas, station, user) {
  // Vérifier que l'utilisateur peut insérer sur cette station

  // Vérifier les données en fonction de l'intervalle de la Station (que l'intervalle soit respectée)

  // inserer donnée une à une

  // ? si collision dans la date ?

  // Va falloir utiliser Promise.all(les promesses).then etc : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
}

/*
 * Méthode utilisée pour vérifier que la date passée correcponde à l'intervalle donnée.
 * @param {string} interval L'intervalle de la id_station
 * @param {date} date La date d'entrée de la donnée
 */

function isCorrect(interval, date) {
  // Intervalle existante : ['1min', '5min', '10min', '15min', '30min', '1h', '2h', '6h', '12h', '24h'];
}