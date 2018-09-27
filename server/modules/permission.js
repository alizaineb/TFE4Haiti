'use strict';
const logger = require('./logger');


var isAllowed = function(...allowed){
	const isAllowed = role => allowed.indexOf(role) > -1;

	return (req, res, next) => {
		logger.info("[ROLES]  ", allowed);

		/*if(!allowed){
			next();
		}*/
		logger.info("[ROLES] |", req.token_decoded, "|");
		if(req.user && isAllowed(req.user.type)){
			next();
		}else{
			res.status(403).send({message: "Forbidden"});
		}
	}
};

exports.isAllowed = isAllowed;