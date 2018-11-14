'use strict';
const path = require('path');
const fs = require('fs');
const nconf = require('nconf');
const mailer = require('./mailer');

const formidable = require('formidable');
const logger = require('../config/logger');
const dataModel = require('./../models/data');
const checkParam = require('./utils').checkParam;
const state = require('../config/constants').DataType;

const Station = require("../models/station");
const UsersModel = require("../models/user");
const roles = require('../config/constants').roles;
const DownloadInterval = require('../config/constants').DownloadIntervals;


/**
 * Méthode utilisée pour insérer des données en base de donnée
 * @param {number[]} dates Tableau des données devant être inséérer en base de données
 * @param {Station} station Station pour laquelle il faut insérer les données
 * @param {string} user L'id de l'utilisateur ayant inséré les données
 * ? Besoin d'un autre paramètre ?
 */
let insertData = function(req, res, datas, station, user) {
  // Vérifier que l'utilisateur peut insérer sur cette station

  if (station.users.indexOf(user._id) < 0 && user.role !== roles.ADMIN) { //todo check user access riviere ou commune
    res.status(403).send(`Vous n'avez pas accès à la modification de cette station`);
  } else {

    // Vérifier les données en fonction de l'intervalle de la Station (que l'intervalle soit respectée) si intervalle <1h

    // inserer donnée une à une
    // Si intervalle >1h vérifier l'intégrité des données ?!

    // ? si collision dans la date ?

    // Va falloir utiliser Promise.all(les promesses).then etc : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all

    // console.log("Data to insert : ", datas);
    dataModel.RainDataAwaitingModel.insertMany(datas, (err, docs) => {
      // console.log(err);
      // console.log(docs);
      if (err) {
        // console.log('erreur : ', err);
        res.status(500).send(err.message); //'Les données n\'ont pas sur être insérer...');
      } else {
        res.status(200).send();
      }
    })

  }
};

/**
 * Méthode de récupération des données en attente de validation.
 * @param req L'objet "Request" de la requête
 * @param res L'objet "Response" de la requête
 */
exports.getAwaiting = function(req, res) {
  dataModel.RainDataAwaitingModel.find({}, (err, datas) => {
    if (err) {
      logger.error("[DATACTRL] getAwaiting : ", err);
      return res.status(500).send("Erreur lors de la récupérations des données.")
    } else {
      return res.status(200).send(datas);
    }
  });
};

/**
 * Méthode de validation des données pluviométriques. C'est ici que le cas de la mise à jour ou la validation
 * d'un fichier est géré.
 * @param req req.param.id L'id de la données à valider
 * @param res L'objet "Response" de la requête où il faut repondre
 */
exports.acceptAwaiting = function(req, res) {
  checkParam(req, res, ["id"], function() {
    let id = req.body.id;
    console.log(id);
    dataModel.RainDataAwaitingModel.findById(id, (err, rainDataAwaiting) => {
      if (err) {
        logger.error("[DATACTRL] acceptAwaiting : ", err)
        return res.status(500).send("Erreur lors de la recupération de la donnée.")
      } else {
        let status = 200;
        switch (rainDataAwaiting.type) {
          case state.INDIVIDUAL:
            const rainData = dataModel.RainDataAwaitinToAccepted(rainDataAwaiting);
            rainData.save().then(() => {
              dataModel.RainDataAwaitingModel.deleteOne({ _id: rainDataAwaiting._id }).then(() => {
                res.status(200).send()
              });

            }).catch((err) => {
              return res.status(500).send(err);
            });
            return;
          case state.UPDATE:
            if (!rainDataAwaiting.value) {
              // donnée modifier vers rien, on supprime l'ancienne donnée et la donnée en attente
              dataModel.RainDataAwaitingModel.deleteOne({ _id: rainDataAwaiting._id }).then(() => {
                dataModel.rainDataModel.deleteOne({ _id: rainDataAwaiting.id_old_data }).then(() => {
                  return res.status(200).send();
                }).catch((err) => {
                  return res.status(500).send(err);
                });
              }).catch((err) => {
                return res.status(500).send(err);
              });
            } else {
              dataModel.rainDataModel.findById(rainDataAwaiting.id_old_data, (err, rainData) => {
                rainData.value = rainDataAwaiting.value;
                rainData.save().then(() => {
                  dataModel.RainDataAwaitingModel.deleteOne({ _id: rainDataAwaiting._id }).then(() => {
                    dataModel.rainDataModel.deleteOne({ _id: rainDataAwaiting.id_old_data }).then(() => {
                      return res.status(200).send();
                    }).catch((err) => {
                      return res.status(500).send(err);
                    });
                  }).catch((err) => {
                    return res.status(500).send(err);
                  });
                }).catch(function(err) {
                  logger.error(err);
                  return res.status(500).send("Une erreur est survenue lors de la mise à jours de la donnée.");
                });
              });

            }

            return;
          case state.FILE:
            const filePath = path.join(nconf.get('uploadFolder'), rainDataAwaiting.value);
            fs.readFile(filePath, 'utf-8', (err, fileData) => {
              if (err) {
                res.status(500).send("Le fichier n'a pas pu etre lu.")
              }

              Station.stationModel.findById({ _id: rainDataAwaiting.id_station }, (err, station) => {
                if (err) {
                  logger.error(err);
                  res.status(500).send(`erreur lors de la recupération de la station ${rainDataAwaiting.id_station}`)
                } else {
                  // console.log('[STATION] : ', station);
                  UsersModel.userModel.findById({ _id: rainDataAwaiting.id_user }, (err, user) => {
                    if (err) {
                      logger.error(err);
                      res.status(500).send(`erreur lors de la recupération de l'utilisateur ${rainDataAwaiting.id_user}`)
                    } else {
                      let datas = [];
                      let lines = fileData.split('\n');
                      // console.log(lines);
                      let prevDate = null;
                      let first = true;
                      for (var i = 0; i < lines.length; i++) {
                        var l = lines[i];
                        const d = l.split(';');
                        // console.log(d);
                        if (d.length > 1) {
                          let data = new dataModel.rainDataModel();
                          data.id_station = station._id;
                          data.id_user = user._id;
                          data.date = new Date(d[0]);
                          // console.log(data.date);
                          if (first) {
                            data.value = d[1].replace(',', '.');
                            datas.push(data);
                          } else {
                            if (checkDateInterval(prevDate, data.date, station.interval)) { //todo remove || true
                              data.value = d[1];
                              datas.push(data);
                            } else {
                              res.status(500).send("Les dates du fichier ne se suivent pas, ou ne corresponde pas à l'interval de la station..")
                              return;
                            }
                          }
                          prevDate = data.date;
                        }
                      }
                      // insertData(req, res, datas, station, user)
                      dataModel.rainDataModel.insertMany(datas, (err, docs) => {
                        // console.log(err);
                        // console.log(docs);
                        if (err) {
                          // console.log('erreur : ', err);
                          logger.error('[IMPORTFILE] InsertMany : ', err);
                          res.status(500).send(err); //'Les données n\'ont pas sur être insérer...');
                        } else {
                          const filePath = path.join(nconf.get('uploadFolder'), rainDataAwaiting.value);
                          fs.unlink(filePath, (err) => {
                            logger.error('[IMPORTFILE] unlink : ', err);
                          });
                          dataModel.RainDataAwaitingModel.deleteOne({ _id: rainDataAwaiting._id }).then(() => {
                            res.status(200).send()
                          });
                        }
                      })
                    }

                  });
                }
              });

            });
            return;
          default:
            status = 500;
            break;
        }
        return res.status(status).send();
      }
    });
  });
};

/**
 * Méthode de refus et suppression d'une données pluviométrique en attente de validation.
 * @param req req.param.id L'id de la données à refuser.
 * @param res L'objet "Response" de la requête où il faut repondre
 * @return {*} /
 */
exports.refuseAwaiting = function(req, res) {
  let id = req.params.id || '';
  if (!id) {
    return res.status(400).send("Information manquante(s)");
  }
  dataModel.RainDataAwaitingModel.findById(id, (err, rainDataAwaiting) => {
    logger.info("[DATACTRL] refuseAwaiting.findbyid : ", id, " - ", rainDataAwaiting);
    if (err) {
      logger.error("[DATACTRL] refuseAwaiting : ", err)
      return res.status(500).send("Erreur lors de la recupération de la donnée.")
    } else {
      dataModel.RainDataAwaitingModel.deleteOne({ _id: id }).then(() => {
        if (rainDataAwaiting.type == "file") {
          const filePath = path.join(nconf.get('uploadFolder'), rainDataAwaiting.value);
          fs.unlink(filePath, (err) => {
            logger.error('[IMPORTFILE] remove : ', err);
          });
        }

        return res.status(204).send("ok") //TODO remove body
      }).catch(function(err) {
        logger.error("[DATACTRL] refuseAwaiting.deleteone : ", err);
        return res.status(500).send("Erreur lors du refus de la donnée.");
      });
    }
  });
};

/**
 * Méthode de récupération de toutes les données pluviométriques validées pour une station données.
 * @param req req.param.stationId L'id de la données dont on veut récupérer les données.
 * @param res L'objet "Response" de la requête où il faut repondre
 */
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

/**
 *
 * @param req
 * @param res
 */
//TODO Check si la station n'existe pas
exports.getRainDataGraphLine = function(req, res) {
  Station.stationModel.findById(req.params.stationId, (err, station) => {
    if (err) {
      return res.status(500).send("Erreur lors de la station liée .");
    }
    dataModel.rainDataModel.find({ id_station: req.params.stationId }, 'date value', { sort: { date: 1 } }, function(err, data) {
      if (err) {
        logger.error(err);
        return res.status(500).send("Erreur lors de la récupération des données.");
      }
      //preprocessData(data, req.params.stationId, station.interval);
      let tabD = [];
      data.forEach(data => tabD.push(dataModel.rainDataModel.toDtoGraphLine(data)));
      return res.status(200).send(tabD);
    });
  });
};

/**
 *
 * @param req
 * @param res
 */
//TODO Check si la station n'existe pas
exports.rainDataGraphLineRangeDate = function(req, res) {
  Station.stationModel.findById(req.params.stationId, (err, station) => {
    if (err) {
      return res.status(500).send("Erreur lors de la station liée .");
    }

    let minDate = req.params.minDate;
    let minMonth = req.params.minMonth;
    let minYear = req.params.minYear;
    let maxDate = req.params.maxDate;
    let maxMonth = req.params.maxMonth;
    let maxYear = req.params.maxYear;

    let dateMin = new Date(Date.UTC(minYear, minMonth, minDate, 0, 0, 0, 0));
    let dateMax = new Date(Date.UTC(maxYear, maxMonth, maxDate, 23, 59, 59, 0));

    dataModel.rainDataModel.find({
      id_station: req.params.stationId,
      date: { "$gte": dateMin, "$lt": dateMax }
    }, 'date value', { sort: { date: 1 } }, function(err, data) {
      if (err) {
        logger.error(err);
        return res.status(500).send("Erreur lors de la récupération des données.");
      }
      if (data.length === 0) {
        return res.status(200).send([]);
      } else {
        data = preprocessData(data, req.params.stationId, station.interval, dateMin, dateMax);
        let tabD = [];
        data.forEach(data => tabD.push(dataModel.rainDataModel.toDtoGraphLine(data)));
        return res.status(200).send(tabD);
      }
    });
  });
};


/**
 *
 * @param req
 * @param res
 */
//TODO Check si la station n'existe pas
exports.getRainDataGraphLineOneMonth = function(req, res) {
  Station.stationModel.findById(req.params.stationId, (err, station) => {
    if (err) {
      return res.status(500).send("Erreur lors de la station liée .");
    }
    if (!station) {
      return res.status(400).send("Erreur : station inexistante.");
    }
    let year = req.params.year;
    let month = req.params.month;

    month = parseInt(month, 10);
    //Date month begin to 0 !
    month -= 1;

    let dateMin = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
    let dateMax = new Date(Date.UTC(year, dateMin.getMonth() + 1, 0, 23, 23, 59, 0));


    dataModel.rainDataModel.find({
      id_station: req.params.stationId,
      date: { "$gte": dateMin, "$lt": dateMax }
    }, 'date value', { sort: { date: 1 } }, function(err, data) {
      if (err) {
        logger.error(err);
        return res.status(500).send("Erreur lors de la récupération des données.");
      }
      if (data.length === 0) {
        return res.status(200).send([]);
      } else {
        data = preprocessData(data, req.params.stationId, station.interval, dateMin, dateMax);
        let tabD = [];
        data.forEach(data => tabD.push(dataModel.rainDataModel.toDtoGraphLine(data)));
        return res.status(200).send(tabD);
      }
    });
  });
};

/**
 *
 * @param req
 * @param res
 */
//TODO Check si la station n'existe pas
exports.getRainDataGraphLineOneYear = function(req, res) {
  Station.stationModel.findById(req.params.stationId, (err, station) => {
    if (err) {
      return res.status(500).send("Erreur lors de la station liée .");
    }
    let year = req.params.year;
    let dateMin = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
    let dateMax = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 0));

    dataModel.rainDataModel.find({
      id_station: req.params.stationId,
      date: { "$gte": dateMin, "$lt": dateMax }
    }, 'date value', { sort: { date: 1 } }, function(err, data) {
      if (err) {
        logger.error(err);
        return res.status(500).send("Erreur lors de la récupération des données.");
      }

      let mapValue = new Map();
      let i;
      for (i = 0; i < 12; i++) {
        mapValue.set(i, 0)
      }
      for (let i = 0; i < data.length; i++) {
        let month = data[i].date.getMonth();
        let value = data[i].value;
        mapValue.set(month, mapValue.get(month) + value);
      }
      let tabD = [];
      for (i = 0; i < 12; i++) {
        let d;
        if (i === 11) {
          d = dateMax;
        } else {
          d = new Date(Date.UTC(year, i, 1, 12, 0, 0, 0));
        }
        let val = mapValue.get(i);
        if (val === 0)
          val = null;
        tabD.push(
          [
            d.valueOf(),
            val
          ]
        )
      }
      return res.status(200).send(tabD);
    });
  });
};


/**
 * Fonction qui regroupe les données d'une stations par années.
 * @param RainData Tableau de RainData.
 * @return An Hash map of string => number (ex ('2018' => 500, ...)
 */
function groupByYear(RainData) {
  let mapValue = {};

  for (let i = 0; i < RainData.length; i++) {
    let year = RainData[i].date.getUTCFullYear();
    let value = parseInt(RainData[i].value);
    let oldVal = parseInt(mapValue[year]);
    if (!oldVal) {
      oldVal = 0;
    }
    mapValue[year] = (oldVal + value);
  }

  return mapValue;
}

/**
 * Fonction qui regroupe les données d'une stations par années-mois.
 * @param RainData Tableau de RainData.
 * @return An Hash map of string => number (ex ('2018' => 500, ...)
 */
function groupByMonth(RainData) {
  let mapValue = {};

  for (let i = 0; i < RainData.length; i++) {
    let year = RainData[i].date.getUTCFullYear();
    let month = RainData[i].date.getUTCMonth();
    let value = parseInt(RainData[i].value);
    const key = `${year}-${month}`
    let oldVal = parseInt(mapValue[key]);
    if (!oldVal) {
      oldVal = 0;
    }
    mapValue[key] = (oldVal + value);
  }

  return mapValue;
}

/**
 * Fonction qui regroupe les données d'une stations par années-mois.
 * @param RainData Tableau de RainData.
 * @return An Hash map of string => number (ex ('2018' => 500, ...)
 */
function groupByDay(RainData) {
  let mapValue = {};

  for (let i = 0; i < RainData.length; i++) {
    let year = RainData[i].date.getUTCFullYear();
    let month = RainData[i].date.getUTCMonth();
    let day = RainData[i].date.getUTCDate();
    let value = parseInt(RainData[i].value);
    const key = `${year}-${month}-${day}`
    let oldVal = parseInt(mapValue[key]);
    if (!oldVal) {
      oldVal = 0;
    }
    mapValue[key] = (oldVal + value);
  }

  return mapValue;
}

/**
 *
 * @param RainData
 * @return mapValue
 */
function groupByInterval(RainData) {
  let mapValue = {};

  for (let i = 0; i < RainData.length; i++) {
    let year = RainData[i].date.getUTCFullYear();
    let month = RainData[i].date.getUTCMonth();
    let day = RainData[i].date.getUTCDate();
    let hour = RainData[i].date.getUTCHours();
    let min = RainData[1].date.getUTCMinutes();
    let value = parseInt(RainData[i].value);
    const key = `${year}-${month}-${day} ${hour}:${min}`;
    let oldVal = parseInt(mapValue[key]);
    if (!oldVal) {
      oldVal = 0;
    }
    mapValue[key] = (oldVal + value);
  }
  return mapValue;
}

/**
 *
 * @param req
 * @param res
 */
exports.getForDay = function(req, res) {
  Station.stationModel.findById(req.params.stationId, (err, station) => {
    if (err) {
      return res.status(500).send("Erreur lors de la station liée .");
    }
    if (!station) {
      return res.status(400).send("Erreur : station inexistante.");
    }
    let date = new Date(req.params.date);

    let dateMin = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    let dateMax = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

    dateMax.setHours(dateMax.getHours() + 24);
    Station.stationModel.findById(req.params.stationId, (err, station) => {
      if (err) {
        return res.status(500).send("Erreur lors de la station liée .");
      }
      // TODO Tu peux sélectionner seulement les champs que t'as besoin. J'ai mis en com ce que j'ai changé avant le return.
      dataModel.rainDataModel.find({
        id_station: req.params.stationId,
        date: { "$gte": dateMin, "$lt": dateMax }
      }, ['_id', 'id_station', 'id_user', 'date', 'value'], { sort: { date: 1 } }, function(err, data) {
        if (err) {
          logger.error(err);
          return res.status(500).send("Erreur lors de la récupération des données.");
        }
        //let tabD = [];
        //data.forEach(data => tabD.push(data.toDto()));
        data = preprocessData(data, req.params.stationId, station.interval, dateMin, dateMax);
        return res.status(200).send(data);
      });
    });
  });
};

/**
 *
 * @param req
 * @param res
 * @return {*}
 */
exports.getForMonth = function(req, res) {
  // TODO Check year exsists and motn 1 -> 12
  let year = parseInt(req.params.year);
  let month = parseInt(req.params.month);
  if (year === NaN || year < 1990 || year > 2038) {
    return res.status(400).send("L'année que vous avez entrée est incorrecte.");
  }
  if (month === NaN || month < 1 || month > 12) {
    return res.status(400).send("Le mois que vous avez entré est incorrecte (1-12).");
  }
  Station.stationModel.findById(req.params.stationId, (err, station) => {
    if (err) {
      return res.status(500).send("Erreur lors de la station liée .");
    }
    if (!station) {
      return res.status(400).send("Erreur : station inexistante.");
    }
    month = minTwoDigits(month);
    let dateMin = new Date(year + "-" + month + "-01T00:00:00Z");
    let dateMax = new Date(year + "-" + month + "-01T00:00:00Z");
    dateMax.setMonth(dateMax.getMonth() + 1);
    Station.stationModel.findById(req.params.stationId, (err, station) => {
      if (err) {
        return res.status(500).send("Erreur lors de la station liée .");
      }
      // TODO Tu peux sélectionner seulement les champs que t'as besoin. J'ai mis en com ce que j'ai changé avant le return.
      dataModel.rainDataModel.find({
        id_station: req.params.stationId,
        date: { "$gte": dateMin, "$lt": dateMax }
      }, ['_id', 'id_station', 'id_user', 'date', 'value'], { sort: { date: 1 } }, function(err, data) {
        if (err) {
          logger.error(err);
          return res.status(500).send("Erreur lors de la récupération des données.");
        }
        data = preprocessData(data, req.params.stationId, station.interval, dateMin, dateMax);
        // Ici on vérifie si l'intervalle de la station est en mn, il faut condenser, sinon on renvoie brut.
        if (station.interval.indexOf("h") >= 0) {
          return res.status(200).send(data);
        } else {
          data = condensData(data, station.interval);
          return res.status(200).send(data);
        }
      });
    });
  });
}

/**
 *
 * @param datas
 * @param interval
 * @return {*}
 */
function condensData(datas, interval) {
  if (!datas || datas.length === 0) {
    return;
  }
  let hopSize = 60 / getIntervalInMinute(interval);
  let tableToReturn = [];
  for (let h = 0; h < datas.length; h = h + hopSize) {
    let sum = 0;
    let noData = 0;
    // This loop will compute for one hour
    for (let i = h; i < h + hopSize; i++) {
      if (datas[i] && datas[i].value) {
        sum += datas[i].value;
      } else {
        noData++;
      }
    }
    let cloneObj = {};
    cloneObj.id_station = datas[h].id_station;
    cloneObj.date = datas[h].date;
    if (noData !== hopSize) {
      cloneObj.value = sum;
    }
    tableToReturn.push(cloneObj);
  }
  return tableToReturn;
}

// Cette méthode va remplir les trous de données potentiels en créant une structure de données avec la value à -1
// va entrer les données traitées dans le tableau : this.allDatas
/**
 *
 * @param dataToProcess
 * @param stationId
 * @param interval
 * @param dateDebut
 * @param dateFin
 * @return {*}
 */
function preprocessData(dataToProcess, stationId, interval, dateDebut, dateFin) {
  // Si pas de tableau ou tableau vide
  if (!dataToProcess || dataToProcess.length === 0) {
    return;
  }
  let hopSize = getIntervalInMinute(interval);

  let tabToReturn = [];
  let currDate = dateDebut;
  let idx = 0;
  let intervalInMs = hopSize * 60000;
  while (idx < dataToProcess.length && currDate < dateFin) {
    let currDateMilis = currDate.getTime();
    if (currDateMilis < dataToProcess[idx].date.getTime()) {
      let correctedDate = new Date(currDateMilis);
      let tmp = {};
      tmp.id_station = stationId;
      tmp.date = correctedDate;
      tabToReturn.push(tmp);
    } else {
      tabToReturn.push(dataToProcess[idx]);
      idx++;
    }
    currDate = new Date(currDateMilis + intervalInMs);
  }
  //While pour compléter la fin
  while (currDate < dateFin) {
    let currDateMilis = currDate.getTime();
    let correctedDate = new Date(currDateMilis);
    let tmp = {};
    tmp.id_station = stationId;
    tmp.date = correctedDate;
    tabToReturn.push(tmp);
    currDate = new Date(currDateMilis + intervalInMs);
  }
  return tabToReturn;
};

/**
 *
 * @param n
 * @return {string}
 */
function minTwoDigits(n) {
  return (n < 10 ? '0' : '') + n;
}

/**
 *
 * @param interval
 * @return {number}
 */
function getIntervalInMinute(interval) {
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
    case '1h':
      return 60;
    case '2h':
      return 120;
    case '6h':
      return 360;
    case '12h':
      return 720;
    case '24h':
      return 1440;
    default:
      return -1;
  }
}

/**
 *
 * @param req
 * @param res
 */
exports.importManualData = function(req, res) {

  const datas = req.body;
  const userId = req.token_decoded.id;
  const stationId = req.params.id || '';
  const self = this;

  // console.log('[USERID] ', req.token_decoded);

  let tmp = [];

  Station.stationModel.findById({ _id: stationId }, (err, station) => {
    if (err) {
      logger.error(err);
      res.status(500).send(`erreur lors de la récupération de la station ${stationId}`)
    } else {
      // console.log('[STATION] : ', station);
      UsersModel.userModel.findById({ _id: userId }, (err, user) => {
        if (err) {
          logger.error(err);
          res.status(500).send(`erreur lors de la récupération de l'utilisateur ${userId}`)
        } else {
          // console.log('[USER] : ', user);
          for (let i = 0; i < datas.length; i++) {
            const d = datas[i];
            let data = new dataModel.RainDataAwaitingModel();
            data.id_station = station._id;
            data.id_user = user._id;
            data.date = new Date(d.date);
            data.date = new Date(Date.UTC(data.date.getFullYear(), data.date.getMonth(), data.date.getDate(), data.date.getHours(), data.date.getMinutes(), data.date.getSeconds()));
            data.value = d.value;
            data.type = state.INDIVIDUAL;
            tmp.push(data);
            // console.log(data);
          }

          insertData(req, res, tmp, station, user);
        }
      });
    }
  });
};

/**
 *
 * @param req
 * @param res
 * @return {*}
 */
exports.importFileData = function(req, res) {

  const pathDir = nconf.get('uploadFolder')
  if (!fs.existsSync(pathDir)) {
    fs.mkdirSync(pathDir);
    return res.status(500).send("Veuillez réessyer d'importer le fichier.")
  } else {

    const userId = req.token_decoded.id;
    const stationId = req.params.id || '';
    const self = this;

    Station.stationModel.findById({ _id: stationId }, (err, station) => {
      if (err) {
        logger.error(err);
        return res.status(500).send(`erreur lors de la récupération de la station ${stationId}`)
      } else {
        let form = new formidable.IncomingForm();
        form.uploadDir = pathDir;
        form.parse(req, function(err, fields, files) {
          // console.log(err);
          //       // console.log(fields);
          console.log(files);
          const newName = `${station.name}-${files['CsvFile'].name}`
          const newPath = path.join(pathDir, newName);
          fs.rename(files['CsvFile'].path, newPath, (err) => {

            if (err) {
              logger.error('[IMPORTFILE] Rename :  ', err);
              fs.unlink(files['CsvFile'].path, (err) => {
                logger.error('[IMPORTFILE] remove : ', err);
              });
              res.status(500).send("Le fichier n'a pas pu etre importé.");
            } else {
              let tmp = [];


              // console.log('[STATION] : ', station);
              UsersModel.userModel.findById({ _id: userId }, (err, user) => {
                if (err) {
                  logger.error(err);
                  res.status(500).send(`erreur lors de la récupération de l'utilisateur ${userId}`)
                } else {
                  // console.log('[USER] : ', user);


                  let data = new dataModel.RainDataAwaitingModel();
                  data.id_station = station._id;
                  data.id_user = user._id;
                  data.date = Date.now();
                  data.value = newName; //todo
                  data.type = state.FILE;
                  tmp.push(data);
                  // console.log(data);

                  insertData(req, res, tmp, station, user);
                }
              });


            }
          });

        }) // end parse
      } // end if station err
    }); // en station
  }


};

/**
 *
 * @param req
 * @param res
 */
exports.downloadData = function(req, res) {
  const id_station = req.params.id;
  const from = new Date(req.query.from),
    to = new Date(req.query.to),
    interval = req.query.interval;

  console.log(from, " => ", to, " | ", interval);


  Station.stationModel.findById(id_station, (err, station) => {
    dataModel.rainDataModel.find({
      id_station: id_station,
      date: { "$gte": from, "$lte": to }
    }, 'date value', (err, rainDatas) => {
      if (err) {
        logger.error(err);
        return res.status(500).send(err);
      } else {
        let dataGrouped = rainDatas;

        console.log(interval)
        switch (interval) {
          case DownloadInterval.DAYS:
            dataGrouped = groupByDay(rainDatas);
            break;
          case DownloadInterval.MONTHS:
            dataGrouped = groupByMonth(rainDatas);
            break;
          case DownloadInterval.YEARS:
            dataGrouped = groupByYear(rainDatas);
            break;
          case DownloadInterval.STATION:
            dataGrouped = groupByInterval(rainDatas);
            break;
          default:
            dataGrouped = groupByInterval(rainDatas);
        }
        const result = rainDataToCSV(dataGrouped);
        if (result.length > 0) {
          // console.log("DATAAS8!!")
          // Write File
          const dirDownload = nconf.get("downloadFolder");
          const fileName = `${station.name} ${preFormatDate(rainDatas[0].date)}-${preFormatDate(rainDatas[rainDatas.length-1].date)} - ${interval}.csv`;
          const filePath = path.join(dirDownload, fileName);
          if (!fs.existsSync(dirDownload)) {
            fs.mkdirSync(dirDownload);
          }
          fs.writeFile(filePath, result, 'utf-8', (err) => {
            if (err) throw err;
            // console.log('The file has been saved!', req.token_decoded.id);
            UsersModel.userModel.findById(req.token_decoded.id, (err, user) => {
              const url = `http://localhost:${nconf.get("server:port")}/download/${fileName}`; //TODO CHANGE AND GET HOST URL NOT LOCALHOST
              mailer.sendMailAndIgnoreIfMailInvalid(undefined, undefined, "Download File", user.mail, url, (err) => {
                if (err) {
                  logger.error("[DATACTRL] downloadData : ", err);
                }
              })
            });

          });
        } else {
          console.log("no data...");
          // console.log(result);
          return res.status(404).send("Pas de données trouvées pour la périodes souhaitée.");
        }

        return res.status(200).send();
      }
    });
  });

}

/**
 *
 * @param rainDatas
 * @return {string}
 */
function rainDataToCSV(rainDatas) {
  // console.log("coucou", rainDatas);
  let fileContent = "";
  for (let i in rainDatas) { //= 0; i < rainDatas.length; i++){
    const rainData = rainDatas[i];
    fileContent += `${i};${rainData};\n`
  }
  return fileContent;
}

/**
 *
 * @param date
 * @return {string}
 */
function preFormatDate(date) {
  return `${date.getFullYear()}-${minTwoDigits(date.getMonth())}-${minTwoDigits(date.getDay())} ${minTwoDigits(date.getHours())}:${minTwoDigits(date.getMinutes())}`
}

/**
 *
 * @param req
 * @param res
 * @return {*}
 */
exports.updateData = function(req, res) {
  let id_data = req.body.id_curr_data;
  let data = req.body.data;
  let number = parseInt(data);
  if (number || number == 0) {
    if (number < 0) {
      return res.status(400).send("Le paramètre doit être un chiffre positif.");
    }
    // une donnée ==> autre donnée
    if (id_data) {
      dataModel.rainDataModel.findById(id_data, (err, rainData) => {
        if (err) {
          logger.error("[UTILS] updateData req.body.data : ", err);
          return res.status(500).send("Erreur lors de la récupération de la donnée.");
        }
        if (!rainData) {
          return res.status(404).send("Donnée inexistante.");
        } else {
          let dataToSend = new dataModel.RainDataAwaitingModel();
          dataToSend.id_station = req.params.station_id;
          dataToSend.id_user = req.token_decoded.id;
          dataToSend.id_old_data = id_data;
          dataToSend.date = rainData.date;
          dataToSend.type = state.UPDATE;
          dataToSend.value = data;
          dataToSend.save().then(() => {
            return res.status(201).send();
          }).catch(function(err) {
            logger.error(err);
            return res.status(500).send("Une erreur est survenue lors de la création de la donnée en attente");
          });
        }
      });
    }
    // Pas de donnée => une donnée
    else {
      let date = req.body.date || '';
      if (!date) {
        return res.status(400).send("Une date est requise");
      }
      date = new Date(date);
      let dataToSend = new dataModel.RainDataAwaitingModel();
      dataToSend.id_station = req.params.station_id;
      dataToSend.id_user = req.token_decoded.id;
      dataToSend.date = date;
      dataToSend.type = state.INDIVIDUAL;
      dataToSend.value = data;
      dataToSend.save().then(() => {
        return res.status(201).send();
      }).catch(function(err) {
        logger.error("[dataCtrl] updateData : ", err);
        return res.status(500).send("Une erreur est survenue lors de la modification de la donnée en attente");
      });
    }
  }
  // Si data ==> vide
  else if (req.body.data === undefined || req.body.data === '') {
    // Si il manque la data à laquelle if faut update
    dataModel.rainDataModel.findById(id_data, (err, rainData) => {
      if (err) {
        logger.error("[UTILS] updateData req.body.data : ", err);
        return res.status(500).send("Erreur lors de la récupération de la donnée.");
      }
      if (!rainData) {
        return res.status(404).send("Donnée inexistante.");
      } else {
        let dataToSend = new dataModel.RainDataAwaitingModel();
        dataToSend.id_station = req.params.id_station;
        dataToSend.id_user = req.token_decoded.id;
        dataToSend.date = rainData.date;
        dataToSend.id_old_data = id_data;
        dataToSend.type = state.UPDATE;
        console.log(dataToSend);
        dataToSend.save().then(() => {
          return res.status(201).send();
        }).catch(function(err) {
          logger.error(err);
          return res.status(500).send("Une erreur est survenue lors de la création de la donnée en attente");
        });
      }
    });
  }
  // Si c'es pas un number
  else if (isNaN(number)) {
    return res.status(400).send("Le paramètre doit être un chiffre.");
  } else {
    return res.status(400).send("Mauvaise utilisation de la route");
  }
}

/**
 *
 * @param date1
 * @param date2
 * @param interval
 * @return {boolean}
 */
function checkDateInterval(date1, date2, interval) {
  if (!date1 || !date2 || !interval) {
    return false;
  }
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();
  var diff_ms = date2_ms - date1_ms;
  var interval_minute = getIntervalInMinute(interval);
  // console.log("Date1 : ", date1, " -> ", date1_ms);
  // console.log("Date2 : ", date2, " -> ", date2_ms);
  // console.log("Diff : ", diff_ms, " Interval : ", interval_minute);
  return ((diff_ms / 1000) / 60) == interval_minute;
}

//push();
/** Méthode utilisée pour tester en pushant des données dans base de données
 * En décommentant la ligne //push();
 * Une série de données va être envoyée en DB.
 */
function push() {
  const datas = [];
  const id_user = "5bbdb325d7aec61a195afc96";
  const id_station = "5be2bd09d80a8447302a0f05";
  let ptr = 0;
  let intervalle = 15;
  for (let jour = 1; jour < 6; jour++) {
    for (let i = 2; i <= 25; i++) {
      for (let j = 0; j < 60; j += intervalle) {
        let item = {};
        item.id_station = id_station;
        item.id_user = id_user;
        let date2 = new Date(2018, 10, jour, i, j);
        item.date = date2;
        console.log(date2);
        item.value = getRandomInt(2);
        datas[ptr] = item;
        ptr++
      }
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

/**
 *
 * @param max
 * @return {number}
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


/**
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
  return date.getTime() % val === 0;
}