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
  AWAITING:  "En attente", // En attente de confirmation par l'admin
  PASSWORD_CREATION: "Création mdp", // En attente que l'utilisateur mette/change son mot de passe
  OK: "Ok", // Etat "normal" de l'utilisateur
  DELETED: "Supprimé" // L'utilisateur est supprimé
};

/**
 * Les différentes état d'un utilisateur
 */
exports.stationState = {
  AWAITING: "En attente", // En attente de confirmation par l'admin
  WORKING: "En activité", // en état de fonctionnement
  DELETED: "Pas en activité", // Supprimée
  BROKEN: "En panne" // Cassée
}

/**
 * Les differents format concernant les données
 */
exports.DataType = {
  FILE: "Fichier", // L'ajout d'une donnée est de type fichier
  INDIVIDUAL: "Manuel", // L'ajout d'une donnée est une donnée unique
  UPDATE: "MaJ" // L'ajout d'une donnée est une modification d'une donnée existante
}


/**
 * Les différents formats concernant l'intervalle de download des données
 */
exports.DownloadIntervals = {
  STATION: "Station",
  DAYS: "Jours",
  MONTHS: "Mois",
  YEARS: "years",
  ALL: "Années",
}