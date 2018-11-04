
export class Constantes {

    public  static roles = {
    ADMIN: "administrateur",
    VIEWER: "chercheur",
    WORKER: "employé",
  };

  public static userState = {
    AWAITING: "awaiting",
    PASSWORD_CREATION: "pwd_creation",
    OK: "ok",
    DELETED: "deleted"
  };

  public static stationState = {
    AWAITING: "awaiting",
    WORKING: "working",
    DELETED: "deleted",
    BROKEN: "broken"
  }

  public static DataType = {
    FILE: "file",
    INDIVIDUAL: "individual",
    UPDATE: "update"
  }
}
