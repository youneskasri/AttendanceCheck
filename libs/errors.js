const winston = require("../config/winston");

module.exports = {

	handleAjaxError: handleAjaxError,

	handleError: handleError, 
	
	printError: printError,

	catchErrors: (fn) => (req, res, next) => fn(req, res, next).catch(handleError(next)),

	catchErrorsAJAX: (fn) => (req, res, next) => fn(req, res, next).catch(handleAjaxError(next))
}

function handleAjaxError(res) {
	return err => {
		printError(err);
		res.send({ error: {stack: err.stack, message: err.message} });
	};
}

function handleError(next) {
	return err => {
		printError(err);
		next(err);	
	}
}

function printError(err) {
	//winston.warn("Error".green);	
	//saveErrorStackToFile(err.stack);
	winston.warn("Error message : ".green + err.message);
}
