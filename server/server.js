
const express = require('express');
const app = express();

//Enable bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Enable CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});


var MongoClient = require('mongodb').MongoClient;
var database = undefined;

var dbUrl = 'mongodb://127.0.0.1:27017/TFE4Haiti';
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
