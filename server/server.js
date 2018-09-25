
const express = require('express');
const app = express();


var MongoClient = require('mongodb').MongoClient;
var database = undefined;

var dbUrl = 'mongodb://127.0.0.1:27017/';
MongoClient.connect(dbUrl, function(err, db) {
    if (err) {
        throw err;
    } else {
        database = db;
        console.log('MongoDB connection successful');
    }
});



app.get('/', function (req, res) {
    res.send('Hello World!')
});

app.listen(3000 , function () {
    console.log('Example app listening on port 3000!')
});
