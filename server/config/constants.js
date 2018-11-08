exports.roles = {
  ADMIN: "administrateur",
  VIEWER: "chercheur",
  WORKER: "employé",
};

exports.userState = {
  AWAITING: "awaiting",
  PASSWORD_CREATION: "pwd_creation",
  OK: "ok",
  DELETED: "deleted"
};

exports.stationState = {
  AWAITING: "awaiting",
  WORKING: "working",
  DELETED: "deleted",
  BROKEN: "broken"
}

exports.DataType = {
  FILE: "file",
  INDIVIDUAL: "individual",
  UPDATE: "update"
}

exports.DownloadIntervals = {
  STATION :"default",
  DAYS : "days",
  MONTHS : "month",
  YEARS: "years",
  ALL: "all",
}