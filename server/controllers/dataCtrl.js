const path = require('path');
const fs = require('fs');

const formidable = require('formidable');
const logger = require('../config/logger');
const dataModel = require('./../models/data');
const checkParam = require('./utils').checkParam;

const Station = require("../models/station");
const UsersModel = require("../models/users");
const roles = require('../config/constants').roles;

/*
 * Méthode utilisée pour insérer des données en base de donnée
 * @param {number[]} dates Tableau des données devant être inséérer en base de données
 * @param {Station} station Station pour laquelle il faut insérer les données
 * @param {string} user L'id de l'utilisateur ayant inséré les données
 * ? Besoin d'un autre paramètre ?
 */
insertData = function(req, res, datas, station, user) {
  // Vérifier que l'utilisateur peut insérer sur cette station

  if (station.users.indexOf(user._id) < 0 && user.role !== roles.ADMIN) {
    res.status(403).send(`Vous n'avez pas accès à la modification de cette station`);
  } else {

    // Vérifier les données en fonction de l'intervalle de la Station (que l'intervalle soit respectée) si intervalle <1h

    // inserer donnée une à une
    // Si intervalle >1h vérifier l'intégrité des données ?!

    // ? si collision dans la date ?

    // Va falloir utiliser Promise.all(les promesses).then etc : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all

    console.log("data inserted")
    dataModel.rainDataModel.insertMany(datas, (err, docs) => {
      console.log(err);
      console.log(docs);
      if (err) {
        res.status(500).send('Les données n\'ont pas sur être insérer...');
      } else {
        res.status(200).send();
      }
    })

  }
};


exports.get = function(req, res) {
  dataModel.rainDataModel.find({ id_station: req.params.stationId }, function(err, data) {
    if (err) {
      logger.error(err);
      return res.status(500).send("Erreur lors de la récupération des données.");
    }
    let tabD = [];
    data.forEach(data => tabD.push(data.toDto()));
    return res.status(200).send(tabD);
  });
};

exports.getForDay = function(req, res) {
  let date = new Date(req.params.date);
  let dateMin = new Date(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());
  //console.log(dateMin);
  let dateMax = new Date(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());
  dateMax.setHours(dateMax.getHours() + 24);
  //console.log(dateMax);
  Station.stationModel.findById(req.params.stationId, (err, station) => {
    if (err) {
      return res.status(500).send("Erreur lors de la station liée .");
    }
    dataModel.rainDataModel.find({ id_station: req.params.stationId, date: { "$gte": dateMin, "$lt": dateMax } }, ['_id', 'id_station', 'id_user', 'date', 'value'], { sort: { date: 1 } }, function(err, data) {
      if (err) {
        logger.error(err);
        return res.status(500).send("Erreur lors de la récupération des données.");
      }
      let tabD = [];
      data.forEach(data => tabD.push(data.toDto()));
      console.log(preprocessData(tabD, req.params.stationId, station.interval));
      return res.status(200).send(tabD);
    });
  });
};


// Cette méthode va remplir les trous de données potentiels en créant une structure de données avec la value à -1
// va entrer les données traitées dans le tableau : this.allDatas
function preprocessData(dataToProcess, stationId, interval) {
  // Si pas de tableau ou tableau vide
  if (!dataToProcess || dataToProcess.length == 0) {
    return;
  }
  let hopSize = getHopSize(interval.interval);
  // Get first doit etre minuit sinon on la créée et l'ajoute en 1er
  let firstValueDate = dataToProcess[0].date;
  if (firstValueDate.getHours() != 0 && firstValueDate.getMinutes() != 0) {
    let correctedDate = new Date(firstValueDate.getFullYear() + "-" + (firstValueDate.getMonth() + 1) + "-" + firstValueDate.getDate());
    let tmp = {};
    tmp._id = "-1";
    tmp.id_station = stationId;
    tmp.id_user = "-1";
    tmp.date = correctedDate;
    tmp.value = -1;
    dataToProcess.splice(0, 0, tmp);
  }
  intervalInMs = hopSize * 60000;
  for (let i = 0; i < dataToProcess.length - 1; i++) {
    // Comparer i à i+1
    let firstVal = dataToProcess[i];
    let secVal = dataToProcess[i + 1];
    // Si modulo pas repsecté on créée une nvelle donnée initialisée à -1
    if (firstVal.date.getTime() + intervalInMs != secVal.date.getTime()) {
      let correctedDate = new Date(firstVal.date.getTime() + intervalInMs);
      let tmp = {};
      tmp._id = "-1";
      tmp.id_station = stationId;
      tmp.id_user = "-1";
      tmp.date = correctedDate;
      tmp.value = -1;
      dataToProcess.splice(i + 1, 0, tmp);
    }
  }
  // Check dernière valeur si last valeur + intervalle pas le lendemain, faut ajouter une valeur
  let lastDate = dataToProcess[dataToProcess.length - 1].date;
  let dateShouldBeNextDay = new Date(lastDate.getTime() + intervalInMs);
  if (dateShouldBeNextDay.getDate() == lastDate.getDate()) {
    let tmp = {};
    tmp._id = "-1";
    tmp.id_station = stationId;
    tmp.id_user = "-1";
    tmp.date = dateShouldBeNextDay;
    tmp.value = -1;
    dataToProcess.push(tmp);
  }
  return dataToProcess;
};

function minTwoDigits(n) {
  return (n < 10 ? '0' : '') + n;
}

function getHopSize(interval) {
  switch (interval) {
    case "1min":
      return 1;
    case "5min":
      return 5;
    case "10min":
      return 10;
    case "15min":
      return 15;
    case "30min":
      return 30;
    default:
      return 1;
  }
}

exports.getRainDataGraphLine = function(req, res) {
  dataModel.rainDataModel.find({ id_station: req.params.stationId }, 'date value', function(err, rainData) {
    if (err) {
      logger.error(err);
      return res.status(500).send("Erreur lors de la récupération des données.");
    }
    let tabD = [];
    rainData.forEach(rainData => tabD.push(rainData.toDtoGraphLine()));
    return res.status(200).send(tabD);
  });
};


exports.importManualData = function(req, res) {
  const datas = req.body;
  const userId = req.token_decoded.id;
  const stationId = req.params.id || '';
  const self = this;

  console.log('[USERID] ', req.token_decoded);

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
  });
  Station.stationModel.findById({ _id: stationId }, (err, station) => {
    if (err) {
      logger.error(err);
      res.status(500).send(`erreur lors de la recupération de la station ${stationId}`)
    } else {
      console.log('[STATION] : ', station);
      UsersModel.userModel.findById({ _id: userId }, (err, user) => {
        if (err) {
          logger.error(err);
          res.status(500).send(`erreur lors de la recupération de l'utilisateur ${userId}`)
        } else {
          console.log('[USER] : ', user);
          for (let i = 0; i < datas.length; i++) {
            const d = datas[i];
            let data = new dataModel.rainDataModel();
            data.id_station = station._id;
            data.id_user = user._id;
            data.date = d.date;
            data.value = d.value;
            tmp.push(data);

          }
          insertData(req, res, datas, station, user);
        }

      });
    }
  });
};

exports.importFileData = function(req, res) {
  let form = new formidable.IncomingForm();
  const pathDir = path.join(__dirname, '..', 'public', 'upload');
  form.uploadDir = pathDir;
  form.parse(req, function(err, fields, files) {
    console.log(err);
    console.log(fields);
    console.log(files);
    fs.rename(files['CsvFile'].path, `${files['CsvFile'].path}-${files['CsvFile'].name}`, (err) => {
      if (err) {
        logger.error('[IMPORTFILE] Rename :  ', err);
        fs.unlink(files['CsvFile'].path, (err) => {
          logger.error('[IMPORTFILE] remove : ', err);
        })
        res.status(500).send("Le fichier n'a pas pu etre importé.");
      } else {
        res.status(200).send()
      }
    });

  })

};

//push();
/* Méthode utilisée pour tester en pushant des données dans base de données
 * En décommentant la ligne //push();
 * Une série de données va être envoyée en DB.
 */
function push() {
  const datas = [];
  const id_user = "5bbdb325d7aec61a195afc96";
  const id_station = "5bbf1bf686649912d4642b53";
  let ptr = 0;
  for (let i = 2; i <= 25; i++) {
    for (let j = 0; j < 60; j++) {
      let item = {};
      item.id_station = id_station;
      item.id_user = id_user;

      let date2 = new Date(2018, 9, 11, i, j);
      item.date = date2;
      //console.log(date2);
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
  });
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