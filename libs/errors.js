const winston = require("../config/winston");

const catchErrors = (fn) => (req, res, next) => fn(req, res, next).catch(handleError(req, res, next));

module.exports = {

	handleAjaxError,
	handleError,	
	printError,

	catchErrors,
	/* catchErrors s'occupe déjà des req.xhr, même traitement ici, != nommage juste pour sémantique */
	catchErrorsAJAX: catchErrors
}

function handleError(req, res, next) {	
	return err => {
		printError(err);
		req.xhr ? sendAjaxError({ err, res }) : next(err);
	}
}

function printError(err) {
	winston.warn("Error message : ".green + err.message);
}

function sendAjaxError({ err, res }) {
	return res.send({ error: {stack: err.stack, message: err.message} });
}

/* @Deprecated, is still used in employeeService, fin makaynch async/await */
function handleAjaxError(res) {
	return err => {
		printError(err);
		sendAjaxError({ err, res });
	};
}
