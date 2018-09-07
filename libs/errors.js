const fs = require("fs");

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
	fs.writeFile("catched-error-"+ (new Date().getTime()) +".txt", stackTrace, (err) => {  
		// throws an error, you could also catch it here
		if (err) {
			console.log(err);
		}
	});
}