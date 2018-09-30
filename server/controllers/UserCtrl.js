'use strict';
var logger = require('../modules/logger');
var UsersModel = require('./../models/users');
const jwt = require('../modules/token');

module.exports = {
    login: function (user, res) {
        console.log("1.\n", user)

        UsersModel.userModel.findOne({mail: user.mail, pwd: user.pwd}, function (err, result) {
            console.log("2.", err, "\n")
            if (err) {
                res.status(404).send({error: err});
                return;
            }
            if (!result) {
                res.status(404).send({error: "Login et/ou mot de passe incorrect."})

            } else {
                var token = jwt.createToken(result);
                if(!token){
                    res.status(200).send({current: result.toDto(), token: token});
                }else{
                    const err = "the server was unable to create a token.";
                    logger.error(err);
                    res.status(500).send(err);
                }
            }
        }).catch(function (err) {
            logger.error(err);
            res.status(500).send(err);
        })
    },

    get: function (res) {
        UsersModel.userModel.find({}).then(function (users) {
            let tabU = [];
            users.forEach(user => tabU.push(user.toDto()));
            res.status(200).send({message: tabU});
        }).catch(function (err) {
            logger.error(err);
            res.status(500).send(err);
        })
    },
    getById: function (id, res) {
        //TODO connect to mongodb
        res.status(200).send({message: "Method to implements"});
    },
    getByEmail: function (email, res) {
        //TODO connect to mongodb
        res.status(200).send({message: "Method to implements"});

    },
    create: function (user, res) {
        let uTmp = new UsersModel.userModel();
        uTmp.mail = user.mail;
        uTmp.pwd = user.pwd;
        uTmp.type = user.type;
        uTmp.save().then(() => {
            res.status(200).send({message: uTmp.toDto()});
        }).catch(function (err) {
                logger.error(err);
                res.status(500).send(err);
            })
    },

    update: function (user, res) {
        //TODO connect to mongodb
        res.status(200).send({message: "Method to implements"});
    },

    delete: function (email, res) {
        //TODO connect to mongodb
        res.status(200).send({message: "Method to implements"});
    }
};