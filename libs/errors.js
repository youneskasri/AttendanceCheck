const fs = require("fs");
const moment = require("moment");

module.exports = {

	handleAjaxError: (res) => {
		return err => {
			printError(err);
			res.send({ error: {stack: err.stack, message: err.message} });
		};
	},

	handleError: (next) => {
		return err => {
			printError(err);
			next(err);	
		}
	}, 

	printError: printError
}

function printError(err) {
	console.log("Error".green);	
	saveErrorStackToFile(err.stack);
	console.log("Error message : ".green + err.message);
}

function saveErrorStackToFile(stackTrace) {
	const FORMAT = 'YY-MM-DD-HH-mm-s'
	fs.writeFile("catched-error-"+ (moment().format(FORMAT)) +".txt", stackTrace, (err) => {  
		// throws an error, you could also catch it here
		if (err) {
			console.log(err);
		}
	});
}