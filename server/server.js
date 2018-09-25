'use strict';
/**
 * =============================
 *
 * Main application.
 *
 * =============================
 */

const config = require('./modules/config');
const logger = require('./modules/logger');
const server = require('./modules/server');


function startWebServer() {

    server.start();
}

process.chdir(__dirname);

config.load(function(e) {
    if (e) {
        logger.error(e);

        return;
    }


    startWebServer();
});