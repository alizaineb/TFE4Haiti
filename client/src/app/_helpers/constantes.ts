export class Constantes {

    public  static roles = {
    ADMIN: "administrateur",
    VIEWER: "chercheur",
    WORKER: "employé",
  };

  public static userState = {
    AWAITING: "En attente",
    PASSWORD_CREATION: "Création mdp",
    OK: "Ok",
    DELETED: "Supprimé"
  };

  public static stationState = {
    AWAITING: "En attente",
    WORKING: "En activité",
    DELETED: "Pas en activité",
    BROKEN: "En panne"
  };

  public static DataType = {
    FILE: "Fichier",
    INDIVIDUAL: "Manuel",
    UPDATE: "MaJ"
  };

  public static DownloadIntervals = {
    STATION :"Station",
    DAYS : "Jours",
    MONTHS : "Mois",
    YEARS: "Années",
  };
}
