'use strict';
const express = require('express');
const app = express();
const nconf = require('nconf');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var fs = require('fs');

/**
 * =============================
 *
 * Main application.
 *
 * =============================
 */

const config = require('./config/config');
const logger = require('./config/logger')

/**
 * Méthode de configuration des requetes sur le serveur
 */
function configureServer() {
    // Parser
    app.use((req, res, next) => {
        bodyParser.json({
            verify: addRawBody,
        })(req, res, (err) => {
            if (err) {
                console.log(err);
                res.status(400).send("Wrong json format.");
                return;
            }
            next();
        });
    });
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json({limit: '50mb', strict: true}));

    app.use('/', express.static('public'));
    app.use('/upload/*', express.static('public/upload'));
    app.use('/download/*', express.static('public/download'));


    // methode d'autorisation pour les requêtes des provenant de client extérieurs.
    app.use(function (request, response, next) {
        logger.info('[Server] Received request for ' + request.method + ' ' + request.path);

        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        response.header('Access-Control-Allow-Headers', 'Authorization, Content-Type, x-access-token');

        if (request.method === 'OPTIONS') {
            return response.sendStatus(200);
        }


        return next();
    });

    // Test et/ou création des dossiers download et upload
    const uploadPath = nconf.get('uploadFolder')
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
        console.log('Created upload.')
        // Do something
    }
    const downloadPath = nconf.get('downloadFolder');
    if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath);
        console.log('Created Download.')
        // Do something
    }
}

/**
 * addRawBody - M2thode utilisée pour vérifier si la requete est correctement formatée (au format json)
 *
 * @param {request}     req Requête du client
 * @param {response}    res Réponse renvoyée au client
 * @param  {string[]}   buf      Le raw body de la requête
 * @param               encoding /
 */
function addRawBody(req, res, buf, encoding) {
    req.rawBody = buf.toString();
}

/**
 * Methode de configuration de la Base de données
 * @param cb callback appelé si la connection à la DB est ok.
 */
function configureDB(cb) {
    //Connect to mongoDB server
    let url = 'mongodb://' + nconf.get('database:login') + ':' + nconf.get('database:password') + '@' + nconf.get('database:host') + ':' + nconf.get('database:port') + '/' + nconf.get('database:name');
    mongoose.set('debug', nconf.get('development'));
    mongoose.set('useCreateIndex', true);

    mongoose.connect(url, {useNewUrlParser: true}).then(
        () => {
            //Require the models
            // Import and use model in mongoose
            // require('./../models/donnee');
            // require('./../models/mdp_recuperation');
            // require('./../models/station');
            require('./models/user');

            cb()
        },
        err => {
            logger.error('[Database] Impossible de se connecter à la base de données.')
        }
    );
}

/**
 * Méthode de démarrage du serveur.
 */
function startWebServer() {
    // Configure le serveur
    configureServer();

    //Configure la base de données
    configureDB(() => {
        //TODO : ajout d'une fvérification que la configuration mail est correcte style on envoie un mail en mode le serveur est lancé (et en dev=true ça se fait pas ^^).
        // Gestion des routes
        require('./routes/server')(app);

        app.get('*', (req, res) => {
            res.sendfile('public/index.html');
        });

        // Lancement du serveur
        const port = process.env.PORT || nconf.get('server').port;
        console.log("[Server] start on port : ", port);
        app.listen(port);
    });

}

process.chdir(__dirname);

// vérification et chargement des configuration et démarrage du serveur si aucune erreur est renvoyée
config.load(function (e) {
    if (e) {
        logger.error(e);
        return;
    }
    startWebServer();
});