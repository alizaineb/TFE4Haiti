'use strict';

/**
 * =============================
 *
 * Mongoddb
 * This is the file where we can get a connection to the mongodb instance
 *
 * =============================
 *
 * Attributes : /
 *
 * Methods :
 *  - getconnexion
 *  - stop
 *
 * Events : /
 *
 * =============================
 */

var logger = require('./logger');

var mongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    config = require('./../config.json');

var dbhost = config.database.host, dbport = config.database.port;
var url = 'mongodb://'+ dbhost + ':' + dbport+'/TFE4Haiti';

var myDb;

var connect = mongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    console.log("Database connected!");
    //TODO Create collection if doesn't exist??
    var dbo = db.db("TFE4Haiti");
    //create collection for users
    dbo.createCollection(config.database.collections.users, function(err, res) {
        if (err) throw err;
        console.log("Collection created!");
    });
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

