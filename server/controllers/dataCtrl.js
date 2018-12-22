'use strict';
/*
 * Controlleur reprenant toutes les méthodes liées aux données
 */
// Modules nodes
const path = require('path');
const fs = require('fs');
const nconf = require('nconf');
const formidable = require('formidable');

// Nos modules
const logger = require('../config/logger');

// Gestion des mails
const mailer = require('./mailer');

// Constates
const state = require('../config/constants').DataType;
const errors = require('./utils').errors;
const roles = require('../config/constants').roles;
const URL = nconf.get("server:url");
const DownloadInterval = require('../config/constants').DownloadIntervals;

// Methodes utilitaires
const utils = require('../controllers/utils');

// Modèles
const DataModel = require('./../models/data');
const StationModel = require("../models/station");
const UsersModel = require("../models/user");

/**
 * insertData - Méthode utilisée pour insérer des données en base de donnée
 * @param {request} req Requête du client
 * @param {response} res Réponse renvoyée au client
 *                   500 : Erreur serveur
 * @param req req.param.id L'id de la données à valider
 * @param {number[]} dates Tableau des données devant être inséérer en base de données
 * @param {Station} station Station pour laquelle il faut insérer les données
 * @param {string} user L'id de l'utilisateur ayant inséré les données
 * @return ??? TODO
 */
let insertData = function(req, res, datas, station, user) {
  // Vérifier que l'utilisateur peut insérer sur cette station
  utils.hasAccesToStationBoolean(req, res, user._id, station._id, () => {
    DataModel.RainDataAwaitingModel.insertMany(datas, (err, docs) => {
      if (err) {
        return res.status(500).send(err.message); //'Les données n\'ont pas sur être insérer...');
      } else {
        return res.status(200).send();
      }
    })
  });
}

/**
 * getAwaiting - Méthode de récupération des données en attente de validation.
 * @param {request} req Requête du client
 * @param {response} res Réponse renvoyée au client
 *                   500 : Erreur serveur
 * @return {data[]} 200 : Toutes les données en attente de confirmation
 */
exports.getAwaiting = function(req, res) {
  DataModel.RainDataAwaitingModel.find({}, (err, datas) => {
    if (err) {
      logger.error("[DATACTRL] getAwaiting : ", err);
      return res.status(500).send("Erreur lors de la récupérations des données.");
    } else {
      return res.status(200).send(datas);
    }
  });
};

/**
 * acceptAwaiting - Méthode de validation des données pluviométriques. C'est ici que le cas de la mise à jour ou la validation
 * d'un fichier est gérée.
 * @param {request} req Requête du client
 * @param {response} res Réponse renvoyée au client
 *                   404 : Données n'existe pas
 *                   500 : Erreur serveur
 * @param req req.param.id L'id de la données à valider
 * @return           200
 */
exports.acceptAwaiting = function(req, res) {
  let id = req.body.id;
  DataModel.RainDataAwaitingModel.findById(id, (err, rainDataAwaiting) => {
    if (err) {
      logger.error("[DATACTRL] acceptAwaiting : ", err)
      return res.status(500).send("Erreur lors de la recupération de la donnée.")
    } else {
      if (!rainDataAwaiting) {
        return rs.status(404).send("Données non trouvées.");
      }
      let status = 200;
      switch (rainDataAwaiting.type) {
        case state.INDIVIDUAL:
          const rainData = DataModel.RainDataAwaitinToAccepted(rainDataAwaiting);
          StationModel.stationModel.findById(rainData.id_station, (err, station) => {
            if (checkInterval(rainData.date, station.interval)) {
              rainData.save().then(() => {
                DataModel.RainDataAwaitingModel.deleteOne({ _id: rainDataAwaiting._id }).then(() => {
                  return res.status(200).send()
                });

              }).catch((err) => {
                logger.error("[DATACTRL] acceptAwaiting1 : ", err)
                let tmp = errors(err);
                return res.status(tmp.error).send("Certaines données existent déjà pour cette date.");
              });
            } else {
              return res.status(500).send("L'intervalle de la donnée ne correspond pas celui de la station.")
            }
          });
          return;
        case state.UPDATE:
          //suppression de la valeur.
          if (!rainDataAwaiting.value) {
            // donnée modifier vers rien, on supprime l'ancienne donnée et la donnée en attente
            DataModel.RainDataAwaitingModel.deleteOne({ _id: rainDataAwaiting._id }).then(() => {
              DataModel.rainDataModel.deleteOne({ _id: rainDataAwaiting.id_old_data }).then(() => {
                return res.status(200).send();
              }).catch((err) => {
                return res.status(500).send(err);
              });
            }).catch((err) => {
              return res.status(500).send(err);
            });
          } else {
            //MaJ de l'ancienne valeur
            DataModel.rainDataModel.findById(rainDataAwaiting.id_old_data, (err, rainData) => {
              rainData.value = rainDataAwaiting.value;

              StationModel.stationModel.findById(rainData.id_station, (err, station) => {

                if (checkInterval(rainData.date, station.interval)) {
                  rainData.save().then(() => {
                    DataModel.RainDataAwaitingModel.deleteOne({ _id: rainDataAwaiting._id }).then(() => {
                      return res.status(200).send();
                    }).catch((err) => {
                      return res.status(500).send(err);
                    });
                  }).catch(function(err) {
                    logger.error("[DATACTRL] acceptAwaiting2 : ", err)
                    let tmp = errors(err);
                    return res.status(tmp.error).send("Certaines données existent déjà pour cette date.");
                  });
                } else {
                  return res.status(500).send("L'intervalle de la donnée ne correspond pas celui de la station.")
                }
              });

            });

          }

          return;
        case state.FILE:
          const filePath = path.join(nconf.get('uploadFolder'), rainDataAwaiting.value);
          fs.readFile(filePath, 'utf-8', (err, fileData) => {
            if (err) {
              return res.status(500).send("Le fichier n'a pas pu etre lu.")
            }

            StationModel.stationModel.findById({ _id: rainDataAwaiting.id_station }, (err, station) => {
              if (err) {
                logger.error("[DATACTRL] acceptAwaiting3 : ", err)
                return res.status(500).send(`erreur lors de la recupération de la station ${rainDataAwaiting.id_station}`)
              } else {
                UsersModel.userModel.findById({ _id: rainDataAwaiting.id_user }, (err, user) => {
                  if (err) {
                    logger.error("[DATACTRL] acceptAwaiting4 : ", err)
                    return res.status(500).send(`erreur lors de la recupération de l'utilisateur ${rainDataAwaiting.id_user}`)
                  } else {
                    let datas = [];
                    let lines = fileData.split('\n');
                    let prevDate = null;
                    let first = true;


                    for (var i = 0; i < lines.length; i++) {
                      const regex1 = /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{2,4}\s[0-9]{1,2}:[0-9]{1,2}(:[0-9]{1,2})?;\s*[0-9\.\,]+/gm;
                      const regex2 = /[0-9]{2,4}\-[0-9]{1,2}\-[0-9]{1,2}\s[0-9]{1,2}:[0-9]{1,2}(:[0-9]{1,2})?;\s*[0-9\.\,]+/gm;

                      var l = lines[i];
                      const d = l.split(';');
                      if (l.trim() == '') {
                        continue;
                      }
                      let datetmp = d[0];
                      if (regex1.test(l)) {
                        datetmp = dateRegex1(d[0]);
                      } else if (regex2.test(l)) {
                        datetmp = dateRegex2(d[0]);
                      } else {
                        return res.status(500).send("Les dates du fichier ne respecte pas le format à la Ligne " + (i + 1));
                      }

                      if (d.length > 1) {
                        let data = new DataModel.rainDataModel();
                        data.id_station = station._id;
                        data.id_user = user._id;
                        data.value = d[1].replace(',', '.');
                        data.date = datetmp;
                        if (checkInterval(data.date, station.interval)) {
                          datas.push(data);
                        } else {
                          return res.status(500).send("L'intervalle du fichier ne correspond pas celui de la station. (Ligne " + (i + 1) + ")")
                        }
                      }
                    }
                    //res.status(200).send();
                    // insertData(req, res, datas, station, user)
                    DataModel.rainDataModel.insertMany(datas, (err, docs) => {
                      if (err) {
                        logger.error('[IMPORTFILE] InsertMany : ', err);
                        let tmp = errors(err);
                        return res.status(tmp.error).send("Certaines données existent déjà pour une des dates du fichier.");
                      } else {
                        const filePath = path.join(nconf.get('uploadFolder'), rainDataAwaiting.value);
                        fs.unlink(filePath, (err) => {
                          logger.error('[IMPORTFILE] unlink : ', err);
                        });
                        DataModel.RainDataAwaitingModel.deleteOne({ _id: rainDataAwaiting._id }).then(() => {
                          return res.status(200).send()
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
};


/**
 * dateRegex1 - Regex pour une date si la date est divisée via  '/'
 *
 * @param  {string} dateStr la date au format string
 * @return {Date}           La date au format UTC
 */
function dateRegex1(dateStr) {
  let tab = dateStr.split('/');
  const day = tab[0],
    month = tab[1];
  let tab1 = tab[2].split(' ');
  const year = tab1[0];
  let tab2 = tab1[1].split(':');
  const hours = tab2[0],
    min = tab2[1];
  return new Date(Date.UTC(year, month - 1, day, hours, min, 0));
}

/**
 * dateRegex2 - Regex pour une date si la date est divisée via  '/'
 *
 * @param  {string} dateStr la date au format string
 * @return {Date}           La date au format UTC
 */
function dateRegex2(dateStr) {
  let tab = dateStr.split('-');
  const year = tab[0],
    month = tab[1];
  let tab1 = tab[2].split(' ');
  const day = tab1[0];
  let tab2 = tab1[1].split(':');
  const hours = tab2[0],
    min = tab2[1];
  return new Date(Date.UTC(year, month - 1, day, hours, min, 0));
}

/**
 * refuseAwaiting - Méthode de refus et suppression d'une données pluviométrique en attente de validation.
 * @param {request} req Requête du client
 * @param {response} res Réponse renvoyée au client
 *                   400 : Information manquante
 *                   500 : Erreur serveur
 * @return           204
 */
exports.refuseAwaiting = function(req, res) {
  let id = req.params.station_id || '';
  if (!id) {
    return res.status(400).send("Information manquante(s)");
  }
  DataModel.RainDataAwaitingModel.findById(id, (err, rainDataAwaiting) => {
    logger.info("[DATACTRL] refuseAwaiting.findbyid : ", id, " - ", rainDataAwaiting);
    if (err) {
      logger.error("[DATACTRL] refuseAwaiting : ", err)
      return res.status(500).send("Erreur lors de la recupération de la donnée.")
    } else {
      DataModel.RainDataAwaitingModel.deleteOne({ _id: id }).then(() => {
        if (rainDataAwaiting.type == "file") {
          const filePath = path.join(nconf.get('uploadFolder'), rainDataAwaiting.value);
          fs.unlink(filePath, (err) => {
            logger.error('[IMPORTFILE] remove : ', err);
          });
        }
        return res.status(204).send();
      }).catch(function(err) {
        logger.error("[DATACTRL] refuseAwaiting.deleteone : ", err);
        return res.status(500).send("Erreur lors du refus de la donnée.");
      });
    }
  });
};

/**
 * get - Méthode de récupération de toutes les données pluviométriques validées pour une station données.
 * @param {request} req Requête du client
 * @param {response} res Réponse renvoyée au client
 *                   500 : Erreur serveur
 * @return {data[]}  200 : Toutes les données
 */
exports.get = function(req, res) {
  DataModel.rainDataModel.find({ id_station: req.params.station_id },
    '_id id_station id_user date value',
    function(err, datas) {
      if (err) {
        logger.error("[DATACTRL] get : ", err);
        return res.status(500).send("Erreur lors de la récupération des données.");
      }
      return res.status(200).send(datas);
    });
};


/**
 * rainDataGraphLineRangeDate - Méthode qui permet de récupérer les données d'une station pour une période définie par 2 dates.
 *
 * @param {request} req Requête du client
 * @param {string} req.params.stationId L'id de la station à mettre à jour
 * @param {string} req.params.minDate Date début jour
 * @param {string} req.params.minMonth Date début mois
 * @param {string} req.params.minYear Date début année
 * @param {string} req.params.maxDate Date fin jour
 * @param {string} req.params.maxMonth Date fin mois
 * @param {string} req.params.maxYear Date fin année
 * @param {response} res Réponse renvoyée au client
 *                       404 : Station inexistante
 *                       500 : Erreur serveur
 * @return {station}     201 : Un tableau vide ou avec des données formatées pour Highstock
 */
exports.rainDataGraphLineRangeDate = function(req, res) {
  StationModel.stationModel.findById(req.params.station_id, (err, station) => {
    if (err) {
      logger.error("[DATACTRL] rainDataGraphLineRangeDate : ", err);
      return res.status(500).send("Erreur lors de la récupération de la station.");
    }
    if (!station) {
      return res.status(404).send("La station n'existe pas");
    }

    let minDate = req.params.minDate;
    let minMonth = req.params.minMonth;
    let minYear = req.params.minYear;
    let maxDate = req.params.maxDate;
    let maxMonth = req.params.maxMonth;
    let maxYear = req.params.maxYear;

    let dateMin = new Date(Date.UTC(minYear, minMonth, minDate, 0, 0, 0, 0));
    let dateMax = new Date(Date.UTC(maxYear, maxMonth, maxDate, 23, 59, 59, 0));

    DataModel.rainDataModel.find({ id_station: req.params.station_id, date: { "$gte": dateMin, "$lt": dateMax } },
      'date value', { sort: { date: 1 } },
      function(err, data) {
        if (err) {
          logger.error("[DATACTRL] rainDataGraphLineRangeDate : ", err);
          return res.status(500).send("Erreur lors de la récupération des données.");
        }
        if (data.length === 0) {
          return res.status(201).send([]);
        } else {
          data = preprocessData(data, req.params.station_id, station.interval, dateMin, dateMax);
          let tabD = [];
          data.forEach(data => tabD.push(DataModel.rainDataModel.toDtoGraphLine(data)));
          return res.status(201).send(tabD);
        }
      });
  });
};


/**
 * getRainDataGraphLineOneMonth - Méthode qui permet de récupérer les données d'une station pour une période d'un mois
 *
 * @param {request} req Requête du client
 * @param {string} req.params.station_id L'id de la station à mettre à jour
 * @param {string} req.params.year Année
 * @param {string} req.params.month Mois
 * @param {response} res Réponse renvoyée au client
 *                       404 : Station inexistante
 *                       500 : Erreur serveur
 * @return {station}     201 : Un tableau vide ou avec des données formatées pour Highstock
 */
exports.getRainDataGraphLineOneMonth = function(req, res) {
  StationModel.stationModel.findById(req.params.station_id, (err, station) => {
    if (err) {
      logger.error("[DATACTRL] getRainDataGraphLineOneMonth : ", err);
      return res.status(500).send("Erreur lors de la récupération de la station.");
    }
    if (!station) {
      return res.status(404).send("La station n'existe pas");
    }

    let year = req.params.year;
    let month = req.params.month;

    month = parseInt(month, 10);
    //Date month begin to 0 !
    month -= 1;

    let dateMin = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
    let dateMax = new Date(Date.UTC(year, dateMin.getMonth() + 1, 0, 23, 23, 59, 0));

    DataModel.rainDataModel.find({ id_station: req.params.station_id, date: { "$gte": dateMin, "$lt": dateMax } },
      'date value', { sort: { date: 1 } },
      function(err, data) {
        if (err) {
          logger.error("[DATACTRL] getRainDataGraphLineOneMonth : ", err);
          return res.status(500).send("Erreur lors de la récupération des données.");
        }
        if (data.length === 0) {
          return res.status(201).send([]);
        } else {
          data = preprocessData(data, req.params.station_id, station.interval, dateMin, dateMax);
          let tabD = [];
          data.forEach(data => tabD.push(DataModel.rainDataModel.toDtoGraphLine(data)));
          return res.status(201).send(tabD);
        }
      });
  });
};

/**
 * getRainDataGraphLineOneYear - Méthode qui permet de récupérer les données d'une station pour une période d'un an
 *
 * @param {request} req Requête du client
 * @param {string} req.params.station_id L'id de la station à mettre à jour
 * @param {string} req.params.year Année
 * @param {response} res Réponse renvoyée au client
 *                       404 : Station inexistante
 *                       500 : Erreur serveur
 * @return {station}     201 : Un tableau vide ou avec des données formatées pour Highstock
 */
exports.getRainDataGraphLineOneYear = function(req, res) {
  StationModel.stationModel.findById(req.params.station_id, (err, station) => {
    if (err) {
      logger.error("[DATACTRL] getRainDataGraphLineOneYear : ", err);
      return res.status(500).send("Erreur lors de la récupération de la station.");
    }
    if (!station) {
      return res.status(404).send("La station n'existe pas");
    }
    let year = req.params.year;
    let dateMin = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
    let dateMax = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 0));

    DataModel.rainDataModel.find({
      id_station: req.params.station_id,
      date: { "$gte": dateMin, "$lt": dateMax }
    }, 'date value', { sort: { date: 1 } }, function(err, data) {
      if (err) {
        logger.error("[DATACTRL] getRainDataGraphLineOneYear : ", err);
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
      return res.status(201).send(tabD);
    });
  });
};

/**
 * groupByYear - Fonction qui regroupe les données d'une stations par années.
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
 * groupByMonth - Fonction qui regroupe les données d'une stations par années-mois.
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
 * groupByDay - Fonction qui regroupe les données d'une stations par années-mois.
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
 * groupByInterval - Méthode qui regroupe les données d'une station sur base de son interval
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
 * getForDay - Méthode permettant de récupérer toutes les données pour une journée
 *
 * @param {request} req Requête du client
 * @param {string} req.params.date La date pour laquelle les données doivent être récupérées
 * @param {response} res Réponse renvoyée au client
 *                   400 : station inexistante
 *                   500 : Erreur serveur
 * @return {data[]}  200 : Toutes les données pour le jour passé en paramètre
 */
exports.getForDay = function(req, res) {
  StationModel.stationModel.findById(req.params.station_id, (err, station) => {
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
    StationModel.stationModel.findById(req.params.station_id, (err, station) => {
      if (err) {
        return res.status(500).send("Erreur lors de la station liée .");
      }
      DataModel.rainDataModel.find({
        id_station: req.params.station_id,
        date: { "$gte": dateMin, "$lt": dateMax }
      }, '_id id_station id_user date value', { sort: { date: 1 } }, function(err, data) {
        if (err) {
          logger.error("[dataCtrl] getForDay : ", err);
          return res.status(500).send("Erreur lors de la récupération des données.");
        }
        data = preprocessData(data, req.params.station_id, station.interval, dateMin, dateMax);
        return res.status(200).send(data);
      });
    });
  });
};

/**
 * getForMonth - Méthode permettant de récupérer toutes les données pour un mois
 *
 * @param {request} req Requête du client
 * @param {string} req.params.year L'année pour laquelle les données doivent être récupérées
 * @param {string} req.params.month Le mois pour lequel les données doivent être récupérées
 * @param {response} res Réponse renvoyée au client
 *                   400 : Année incorrecte, mois incorrect, station inexistante
 *                   500 : Erreur serveur
 * @return {data[]}  200 : Toutes les données pour le mois demandé (passé en paramètre)
 */
exports.getForMonth = function(req, res) {
  let year = parseInt(req.params.year);
  let month = parseInt(req.params.month);
  if (year === NaN || year < 1990 || year > 2038) {
    return res.status(400).send("L'année que vous avez entrée est incorrecte.");
  }
  if (month === NaN || month < 1 || month > 12) {
    return res.status(400).send("Le mois que vous avez entré est incorrecte (1-12).");
  }
  StationModel.stationModel.findById(req.params.station_id, (err, station) => {
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
    StationModel.stationModel.findById(req.params.station_id, (err, station) => {
      if (err) {
        return res.status(500).send("Erreur lors de la station liée .");
      }
      DataModel.rainDataModel.find({
        id_station: req.params.station_id,
        date: { "$gte": dateMin, "$lt": dateMax }
      }, '_id id_station id_user date value', { sort: { date: 1 } }, function(err, data) {
        if (err) {
          logger.error("[dataCtrl] getForMonth : ", err);
          return res.status(500).send("Erreur lors de la récupération des données.");
        }
        data = preprocessData(data, req.params.station_id, station.interval, dateMin, dateMax);
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
 * condensData - Permet de condenser les données en fonction de l'intervalle ciblée
 *
 * @param  {data[]} datas    Les données qu'il faut condenser
 * @param  {string} interval li'ntervalle au format string
 * @return {data[]} Les données condensées selon l'intervalle
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

/**
 * preprocessData - Méthode qui va remplire les trous de données potentiels en créant une structure de données avec la value à -1
 * @param dataToProcess Données à process
 * @param stationId Id de la station
 * @param interval Interval de la station
 * @param dateDebut Date de début
 * @param dateFin Date de fin
 * @return {data[]} un tableau ayant des données se suivant selon l'intervalle n'ayant pas de trous
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
 * minTwoDigits - Méthode utilitaire qui renvoie 2 chiffres si on lui en pas que 1 ex: 1 => 01
 * @param n Chiffre
 * @return {string} String avec un 0 devant s'il y a moins de 2 chiffre dans n
 */
function minTwoDigits(n) {
  return (n < 10 ? '0' : '') + n;
}

/**
 * getIntervalInMinute - Méthode utilitaire qui revoit le nombre de minute dans l'interval demandé
 * @param interval Interval d'une station
 * @return {number} Nombre de minute dans cet interval
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
 * importManualData - Méthode d'importation des données manuelles envoyées .
 * @param {request} req Requête du client
 * @param {string} req.params.station_id l'id de la station
 * @param {string} req.body les données
 * @param {response} res Réponse renvoyée au client
 * @return TODO
 */
exports.importManualData = function(req, res) {

  const datas = req.body;
  const userId = req.token_decoded.id;
  const stationId = req.params.station_id || '';
  const self = this;
  let tmp = [];

  StationModel.stationModel.findById({ _id: stationId }, (err, station) => {
    if (err) {
      logger.error("[DATACTRL] importManualData : ", err);
      return res.status(500).send(`erreur lors de la récupération de la station ${stationId}`)
    } else {
      UsersModel.userModel.findById({ _id: userId }, (err, user) => {
        if (err) {
          logger.error("[DATACTRL] importManualData1 : ", err);
          return res.status(500).send(`erreur lors de la récupération de l'utilisateur ${userId}`)
        } else {
          for (let i = 0; i < datas.length; i++) {
            const d = datas[i];
            let data = new DataModel.RainDataAwaitingModel();
            data.id_station = station._id;
            data.id_user = user._id;
            data.date = new Date(d.date);
            //data.date = new Date(Date.UTC(data.date.getFullYear(), data.date.getMonth(), data.date.getDate(), data.date.getHours(), data.date.getMinutes(), data.date.getSeconds()));
            data.value = d.value;
            data.type = state.INDIVIDUAL;

            if (checkInterval(data.date, station.interval)) {
              tmp.push(data);
            } else {
              return res.status(500).send(`L'intervalle de la donnée ${i+1} ne correspond pas celui de la station.`)
            }
          }
          insertData(req, res, tmp, station, user);
        }
      });
    }
  });
};

/**
 * importFileData - Méthode d'importation des données envoyées dans un fichier.
 * @param {request} req Requête du client
 * @param {string} req.params.station_id l'id de la station
 * @param {response} res Réponse renvoyée au client
 *                   404 : L'utilisateur n'existe pas
 *                   500 : Erreur serveur
 * @return TODO
 */
exports.importFileData = function(req, res) {
  const pathDir = nconf.get('uploadFolder');
  if (!fs.existsSync(pathDir)) {
    fs.mkdirSync(pathDir);
    return res.status(500).send("Veuillez réessyer d'importer le fichier.")
  } else {

    const userId = req.token_decoded.id;
    const stationId = req.params.station_id || '';
    const self = this;

    StationModel.stationModel.findById({ _id: stationId }, (err, station) => {
      if (err) {
        logger.error("[DATACTRL] importFileData : ", err);
        return res.status(500).send(`erreur lors de la récupération de la station ${stationId}`)
      } else {
        let form = new formidable.IncomingForm();
        form.uploadDir = pathDir;
        form.parse(req, function(err, fields, files) {
          const newName = `${station.name}-${files['CsvFile'].name}`
          const newPath = path.join(pathDir, newName);
          fs.rename(files['CsvFile'].path, newPath, (err) => {

            if (err) {
              logger.error('[DATACTRL] importFileData1 :  ', err);
              fs.unlink(files['CsvFile'].path, (err) => {
                logger.error('[DATACTRL] importFileData2 : ', err);
              });
              return res.status(500).send("Le fichier n'a pas pu etre importé.");
            } else {
              let tmp = [];
              UsersModel.userModel.findById({ _id: userId }, (err, user) => {
                if (err) {
                  logger.error('[DATACTRL] importFileData3 :  ', err);
                  return res.status(500).send(`erreur lors de la récupération de l'utilisateur ${userId}`)
                } else {
                  let data = new DataModel.RainDataAwaitingModel();
                  data.id_station = station._id;
                  data.id_user = user._id;
                  data.date = Date.now();
                  data.value = newName; //todo
                  data.type = state.FILE;

                  const filePath = path.join(nconf.get('uploadFolder'), data.value);
                  fs.readFile(filePath, 'utf-8', (err, fileData) => {
                    if (err) {
                      return res.status(500).send("Le fichier n'a pas pu etre lu.")
                    }

                    UsersModel.userModel.findById({ _id: data.id_user }, (err, user) => {
                      if (err) {
                        logger.error('[DATACTRL] importFileData4 :  ', err);
                        return res.status(500).send(`erreur lors de la recupération de l'utilisateur ${data.id_user}`)
                      } else {
                        let lines = fileData.split('\n');
                        for (var i = 0; i < lines.length; i++) {
                          const regex1 = /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{2,4}\s[0-9]{1,2}:[0-9]{1,2}(:[0-9]{1,2})?;\s*[0-9\.\,]+/gm;
                          const regex2 = /[0-9]{2,4}\-[0-9]{1,2}\-[0-9]{1,2}\s[0-9]{1,2}:[0-9]{1,2}(:[0-9]{1,2})?;\s*[0-9\.\,]+/gm;

                          var l = lines[i];
                          const d = l.split(';');
                          if (l.trim() == '') {
                            continue;
                          }
                          let datetmp = d[0];
                          if (regex1.test(l)) {
                            datetmp = dateRegex1(d[0]);
                          } else if (regex2.test(l)) {
                            datetmp = dateRegex2(d[0]);
                          } else {
                            return res.status(500).send("Les dates du fichier ne respecte pas le format à la Ligne " + (i + 1));
                          }

                          if (d.length > 1) {
                            let data = new DataModel.rainDataModel();
                            data.id_station = station._id;
                            data.id_user = user._id;
                            data.value = d[1].replace(',', '.');
                            data.date = datetmp;
                            if (!checkInterval(data.date, station.interval)) {
                              return res.status(500).send("L'intervalle du fichier ne correspond pas celui de la station. (Ligne " + (i + 1) + ")")
                            }
                          }
                        }
                        tmp.push(data);
                        insertData(req, res, tmp, station, user);
                      }
                    });
                  });
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
 * downloadData - Méthode qui va créer un fichier contenant les données d'une station dont on veut télécharger les données.
 * Un mail est envoyé à l'utilisateur une fois le ficher prêt.
 * @param {request} req Requête du client
 * @param {response} res Réponse renvoyée au client
 *                   500 : Erreur serveur
 * @return TODO
 */
exports.downloadData = function(req, res) {
  const id_station = req.params.station_id;
  const from = new Date(req.query.from),
    to = new Date(req.query.to),
    interval = req.query.interval;

  StationModel.stationModel.findById(id_station, (err, station) => {
    DataModel.rainDataModel.find({
      id_station: id_station,
      date: { "$gte": from, "$lt": to }
    }, 'date value', (err, rainDatas) => {
      if (err) {
        logger.error('[DATACTRL] downloadData :  ', err);
        return res.status(500).send(err);
      } else {
        if (rainDatas.length == 0) {
          return res.status(404).send("Pas de données trouvées pour la périodes souhaitée.");
        } else {
          res.status(200).send()
          let dataGrouped = rainDatas;

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

          // Write File
          const dirDownload = nconf.get("downloadFolder");
          let fileName = `${station.name}_${preFormatDate(rainDatas[0].date)}-${preFormatDate(rainDatas[rainDatas.length - 1].date)}_${interval}.csv`;
          fileName = fileName.replace(/ /g, '');
          const filePath = path.join(dirDownload, fileName);
          if (!fs.existsSync(dirDownload)) {
            fs.mkdirSync(dirDownload);
          }
          fs.writeFile(filePath, result, 'utf-8', (err) => {
            if (err) throw err; // TODO ???? DAFUQ ???
            UsersModel.userModel.findById(req.token_decoded.id, (err, user) => {
              console.log(user);
              const url = `${URL}/download/${fileName}`; //TODO CHANGE AND GET HOST URL NOT LOCALHOST
              mailer.sendMailAndIgnoreIfMailInvalid(undefined, undefined, "Données à télécharger", user.mail, url, (err) => {
                if (err) {
                  logger.error("[DATACTRL] downloadData : ", err);
                }
                logger.info("[DATACTRL] downloadData : email send to : ", user.mail);
              })
            });

          });
          return;
        }
      }
    });
  });

}

/**
 * rainDataToCSV - Methode utilitaire qui transforme les données d'une station au format CSV
 * @param rainDatas Liste de {Date, Valeur} des données a transformer au format CSV
 * @return {string} String représentant les données dans le format d'un fichier CSV
 */
function rainDataToCSV(rainDatas) {
  let fileContent = "";
  for (let i in rainDatas) { //= 0; i < rainDatas.length; i++){
    const rainData = rainDatas[i];
    fileContent += `${i};${rainData};\n`
  }
  return fileContent;
}

/**
 * preFormatDate - Méthode utilitaire de formattage d'une date pour le format d'exportation des données.
 * @param date Date à formater.
 * @return {string} String de la date formatée.
 */
function preFormatDate(date) {
  return `${date.getFullYear()}-${minTwoDigits(date.getMonth())}-${minTwoDigits(date.getDay())}-${minTwoDigits(date.getHours())}:${minTwoDigits(date.getMinutes())}`
}

/**
 * updateData - Methode de mise à jour d'une donnée.
 * @param {request} req Requête du client
 * @param {response} res Réponse renvoyée au client
 *                   404 : La donnée n'existe pas
 *                   500 : Erreur serveur
 * @return 201
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
      DataModel.rainDataModel.findById(id_data, (err, rainData) => {
        if (err) {
          logger.error("[dataCtrl] updateData : ", err);
          return res.status(500).send("Erreur lors de la récupération de la donnée.");
        }
        if (!rainData) {
          return res.status(404).send("Donnée inexistante.");
        } else {
          let dataToSend = new DataModel.RainDataAwaitingModel();
          dataToSend.id_station = req.params.station_id;
          dataToSend.id_user = req.token_decoded.id;
          dataToSend.id_old_data = id_data;
          dataToSend.date = rainData.date;
          dataToSend.type = state.UPDATE;
          dataToSend.value = data;
          dataToSend.save().then(() => {
            return res.status(201).send();
          }).catch(function(err) {
            logger.error("[dataCtrl] updateData1 : ", err);
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
      let dataToSend = new DataModel.RainDataAwaitingModel();
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
    DataModel.rainDataModel.findById(id_data, (err, rainData) => {
      if (err) {
        logger.error("[dataCtrl] updateData1 : ", err);
        return res.status(500).send("Erreur lors de la récupération de la donnée.");
      }
      if (!rainData) {
        return res.status(404).send("Donnée inexistante.");
      } else {
        let dataToSend = new DataModel.RainDataAwaitingModel();
        dataToSend.id_station = req.params.station_id;
        dataToSend.id_user = req.token_decoded.id;
        dataToSend.date = rainData.date;
        dataToSend.id_old_data = id_data;
        dataToSend.type = state.UPDATE;
        dataToSend.save().then(() => {
          return res.status(201).send();
        }).catch(function(err) {
          logger.error("[dataCtrl] updateData2 : ", err);
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
 * getStats - Méthode qui renvoie les statistiques sur le nombre de données existantes en DB.
 * @param {request} req Requête du client
 * @param {response} res Réponse renvoyée au client
 *                   500 : Erreur serveur
 * @returns {json}   200 : {awaiting : le nombre de données en attente, data : le nombre total de données}
 */
exports.getStats = function(req, res) {
  DataModel.rainDataModel.countDocuments({}, function(err, countOK) {
    if (err) {
      return res.status(500).send();
    }
    DataModel.RainDataAwaitingModel.countDocuments({}, function(err, countAwait) {
      if (err) {
        return res.status(500).send();
      }
      return res.status(200).send({ awaiting: countAwait, data: countOK });
    });
  });
}

/**
 * checkInterval - Permet de vérifier l'inteval
 * @param {Date} datela date
 * @param {string} interval
 * @return {boolean}
 */
function checkInterval(date, interval) {
  const i = getIntervalInMinute(interval);
  const time = date.getTime() / 60000;
  return time % i == 0;
}

/**
 * checkDateInterval - Méthode qui check si l'interval entre 2 date est correcte.
 * @param {Date} date1 Date de départ
 * @param {Date} date2 Date de fin
 * @param {string} interval Interval entre les 2 dates.
 * @return {boolean} True si l'interval est respécté.
 */
function checkDateInterval(date1, date2, interval) {
  if (!date1 || !date2 || !interval) {
    return false;
  }
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();
  var diff_ms = date2_ms - date1_ms;
  var interval_minute = getIntervalInMinute(interval);
  return ((diff_ms / 1000) / 60) == interval_minute;
}

//push();
/** Méthode utilisée pour tester en pushant des données dans base de données
 * En décommentant la ligne //push();
 * Une série de données va être envoyée en DB.
 * /!\ à n'utiliser que si vous savez ce que vous faites /!\
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
        item.value = getRandomInt(2);
        datas[ptr] = item;
        ptr++
      }
    }
  }
  let tmp = [];
  for (let i = 0; i < datas.length; i++) {
    let d = datas[i];
    let data = new DataModel.rainDataModel();
    data.id_station = d.id_station;
    data.id_user = d.id_user;
    data.date = d.date;
    data.value = d.value;
    tmp.push(data);
  }
  DataModel.rainDataModel.insertMany(tmp, (err, docs) => {
    if (err) {
      //res.status(500).send('Les données n\'ont pas sur être insérer...');
    } else {
      //res.status(200).send();
    }
  });
}

/**
 * getRandomInt - Méthode utilitaire qui renvoie un nombre aléatoire < max
 * @param max Valeur maximum pouvant etre renvoyé.
 * @return {number} nombre aléatoire a renvoyé.
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


/**
 * isCorrect Méthode utilisée pour vérifier que la date passée corresponde à l'intervalle donnée.
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