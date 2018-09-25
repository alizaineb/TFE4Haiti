'use strict';

var mongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    config = require('./../config.json');
var url = 'mongodb://localhost:27017';

var myDb;
var musiques = config.collection.musiques;

var connect = mongoClient.connect(url, function(err, db) {
    assert(err==null, "Le serveur rencontre un souci Ã  l'url: "+url);//aucune erreur dÃ©tectÃ©e
    myDb = db;
});

var stop = function(){
    myDb.close();
};

var getConnexion = function(){
    return myDb;
}



exports.getConnexion = getConnexion;
exports.stop = stop;
exports.mongoStart = connect;

