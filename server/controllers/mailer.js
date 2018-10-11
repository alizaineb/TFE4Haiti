'use strict';

const nodemailer = require('nodemailer');
const nconf = require('nconf');

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


exports.sendMail = function(req, res, subject, to, text, callback) {
  var mailOptions = {
    from: nconf.get('mail').user,
    to: to,
    subject: subject,
    text: text
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send("Erreur lors de l'envoi du mail à l'utilisateur.");
    } else {
      return callback();
    }
  });
}

exports.sendMailAndIgnoreIfMailInvalid = function(req, res, subject, to, text, callback) {
  var mailOptions = {
    from: nconf.get('mail').user,
    to: to,
    subject: subject,
    text: text
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return callback();
    } else {
      return callback();
    }
  });
}
// How to use it :
/*
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