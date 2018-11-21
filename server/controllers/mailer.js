'use strict';
/**
 * Ce controlleur contient un ensemble de méthodes permettant d'envoyer un mail
 * Documentation : https://nodemailer.com/about/
 *
 * Exemple d'utilisation provenant du site
var mailOptions = {
  from: nconf.get('mail').user,
  to: 'myfriend@yahoo.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
  ou alors utilise du html :
  html: '<h1>Welcome</h1><p>That was easy!</p>'
};

transporter.sendMail(mailOptions, function(error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
*/
const logger = require('../config/logger');
const nodemailer = require('nodemailer');
const nconf = require('nconf');


/**
 * Le transporteur du mail utilisant différents paramètres repris dans le fichier de configuration
 */
// TODO Enlever reject unautorized à la fin.
var transporter = nodemailer.createTransport({
  host: nconf.get('mail').host,
  port: nconf.get('mail').port,
  secure: nconf.get('mail').secure,
  auth: {
    user: nconf.get('mail').user,
    pass: nconf.get('mail').pwd
  },
  tls: {
    rejectUnauthorized: false
  }
});


/**
 * sendMail - Méthode utilisée pour envoyer un mail
 *
 * @param  {type} req      /
 * @param  {type} res      La réponse à envoyer au client dans le cas ou une erreur se produit
 * @param  {string} subject  Le titre du mail
 * @param  {string} to       Le destinataire du mail
 * @param  {string} text     Le contenu du mail (Balises html supportées)
 * @param  {method} callback La méthode qui va être appelée si tout se pases bien
 * @return {type}          callback
 */
exports.sendMail = function(req, res, subject, to, text, callback) {
  // Les options du mail
  var mailOptions = {
    from: nconf.get('mail').user,
    to: to,
    subject: subject,
    text: text
  };
  // Envoi du mail
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      logger.error("[mailer] sendMail : ", err);
      return res.status(500).send("Erreur lors de l'envoi du mail à l'utilisateur.");
    } else {
      return callback();
    }
  });
};



/**
 * sendMail - Méthode utilisée pour envoyer un mail et ignorer si le mail n'est pas envoyé (utile notemmant si on doit envoyer un mail à une adresse qui pourrait être incorrecte, par exemple la création d'un compte via un mail temporaire)
 *
 * @param  {type} req      /
 * @param  {type} res      La réponse à envoyer au client dans le cas ou une erreur se produit
 * @param  {string} subject  Le titre du mail
 * @param  {string} to       Le destinataire du mail
 * @param  {string} text     Le contenu du mail (Balises html supportées)
 * @param  {method} callback La méthode qui va être appelée si tout se pases bien
 * @return {type}          callback
 */
exports.sendMailAndIgnoreIfMailInvalid = function(req, res, subject, to, text, callback) {
  // Les options du mail
  var mailOptions = {
    from: nconf.get('mail').user,
    to: to,
    subject: subject,
    text: text
  };
  // Envoi du mail
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return callback(); // On ignore si une erreur se produit
    } else {
      return callback();
    }
  });
};