module.exports = {
	printError: (err) => { console.log("Error".green);  },

	handleAjaxError: (err, req, res, next) => {
			console.log(err);
			console.log("Error message : ".green + err.message);
			res.send({ error: {stack: err.stack, message: err.message} });
	}
}