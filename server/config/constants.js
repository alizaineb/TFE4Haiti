'use strict';
/**
 * Fichier reprenant les constantes utilisées dans la back-end
 * Ne pas les modifier sans mettre à jour la base de données
 * Toute modification peut créer des inconsistances
 */


/**
 * Les différentes roles de l'application
 */
exports.roles = {
  ADMIN: "administrateur",
  VIEWER: "chercheur",
  WORKER: "employé",
};


/**
 * Les différentes état d'un utilisateur
 */
exports.userState = {
  AWAITING: "awaiting", // En attente de confirmation par l'admin
  PASSWORD_CREATION: "pwd_creation", // En attente que l'utilisateur mette/change son mot de passe
  OK: "ok", // Etat "normal" de l'utilisateur
  DELETED: "deleted" // L'utilisateur est supprimé
};

/**
 * Les différentes état d'un utilisateur
 */
exports.stationState = {
  AWAITING: "awaiting", // En attente de confirmation par l'admin
  WORKING: "working", // en état de fonctionnement
  DELETED: "deleted", // Supprimée
  BROKEN: "broken" // Cassée
}

/**
 * Les differents format concernant les données
 */
exports.DataType = {
  FILE: "file", // L'ajout d'une donnée est de type fichier
  INDIVIDUAL: "individual", // L'ajout d'une donnée est une donnée unique
  UPDATE: "update" // L'ajout d'une donnée est une modification d'une donnée existante
}


/**
 * Les différents formats concernant l'intervalle de download des données
 */
exports.DownloadIntervals = {
  STATION: "default",
  DAYS: "days",
  MONTHS: "month",
  YEARS: "years",
  ALL: "all",
}