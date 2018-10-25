const logger = require('../config/logger');
const dataModel = require('./../models/data');
const checkParam = require('./utils').checkParam;

/*
 * Méthode utilisée pour insérer des données en base de donnée
 * @param {number[]} dates Tableau des données devant être inséérer en base de données
 * @param {Station} station Station pour laquelle il faut insérer les données
 * @param {string} user L'id de l'utilisateur ayant inséré les données
 * ? Besoin d'un autre paramètre ?
 */

exports.insertData = function(req, res) {
  // Vérifier que l'utilisateur peut insérer sur cette station

  // Vérifier les données en fonction de l'intervalle de la Station (que l'intervalle soit respectée) si intervalle <1h

  // inserer donnée une à une
  // Si intervalle >1h vérifier l'intégrité des données ?!

  // ? si collision dans la date ?

  // Va falloir utiliser Promise.all(les promesses).then etc : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
  const datas = req.body;
  let tmp = [];
  for (let i = 0; i < datas.length; i++) {
    let d = datas[i];
    let data = new dataModel.rainDataModel();
    data.id_station = d.id_station;
    data.id_user = d.id_user;
    data.date = d.date;
    data.value = d.value;
    tmp.push(data);
  }
  dataModel.rainDataModel.insertMany(tmp, (err, docs) => {
    console.log(err);
    console.log(docs);
    if (err) {
      res.status(500).send('Les données n\'ont pas sur être insérer...');
    } else {
      res.status(200).send();
    }
  })
}

//push();

function push() {
  const datas = [];
  const id_user = "5bbdb325d7aec61a195afc96";
  const id_station = "5bcf2b454d8f03350c5cf73e";
  let ptr = 0;
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j++) {
      let item = {};
      item.id_station = id_station;
      item.id_user = id_user;

      let date2 = new Date('2018-10-12T' + padInt(i) + ':' + padInt(j) + ':00');
      item.date = date2;
      item.value = getRandomInt(80);
      datas[ptr] = item;
      ptr++
    }
  }
  let tmp = [];
  for (let i = 0; i < datas.length; i++) {
    let d = datas[i];
    let data = new dataModel.rainDataModel();
    data.id_station = d.id_station;
    data.id_user = d.id_user;
    data.date = d.date;
    data.value = d.value;
    tmp.push(data);
  }
  dataModel.rainDataModel.insertMany(tmp, (err, docs) => {
    console.log(err);
    console.log(docs);
    if (err) {
      //res.status(500).send('Les données n\'ont pas sur être insérer...');
    } else {
      //res.status(200).send();
    }
  })
}

function padInt(val) {
  if (val.toString().length <= 1)
    return "0" + val.toString();
  return val.toString();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
/*
 * Méthode utilisée pour vérifier que la date passée corresponde à l'intervalle donnée.
 * @param {string} interval L'intervalle de la id_station
 * @param {Date} date La date d'entrée de la donnée
 */
function isCorrect(interval, date) {
  // Intervalle existante : ['1min', '5min', '10min', '15min', '30min', '1h', '2h', '6h', '12h', '24h'];
  let val;
  switch (interval) {
    case '1mn':
      val = 60000;
      break;
    case '5mn':
      val = 300000;
      break;
    case '10mn':
      val = 600000;
      break;
    case '15mn':
      val = 900000;
      break;
    case '30mn':
      val = 1800000;
      break;
    default:
      console.log("NOT SUPPORTED TODO A TRAITER");
  }
  return date.getTime() % val == 0;
}