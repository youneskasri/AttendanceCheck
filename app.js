const express = require('express'),
	createError = require('http-errors'),
	mongoose = require('mongoose');

const colors = require('colors');
const winston = require("./config/winston");

/* connect database */
let mongooseOpts = { keepAlive: 120 };
mongoose.connect('mongodb://localhost:27017/attendance-check', mongooseOpts)
	.then(() => winston.info(`Database connected`))
	.catch(err => winston.error(`Database connection error: ${err.message}`));

//require("./seeds").insertRandomEmployees(10); // Seeds

/* App settings */
const app = express()
	.set("port", process.env.PORT || 4000 || 8443)
	.set("env", process.env.ENV || "development")
	.disable("x-powered-by");

	
/* Favicon and public folder */
const favicon = require('express-favicon');
app.use(express.static(__dirname + "/public"))
app.use(favicon(__dirname + '/public/favicon.png'));

const linkMiddlewaresTo = require("./libs/middlewares");
linkMiddlewaresTo(app).setUpHandlebars() // View engine
	.setUpJsonParser() // JSON Parser
	.setUpSession() // Session
	.setUpLoggers() // Loggers
	.setUpRouters(); // Routes


app.enable('view cache');

// use in dev only, sends the full error stack to errorPage
if ( app.get("env") === "development"){
	let errorHandler = require("errorhandler")
	app.use(errorHandler());
}

// catch 404 and error handler
app.use(function(req, res, next) {
	next(createError(404));
}).use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	// render the error page
	res.status(err.status || 500);
	winston.error(err);
	res.render('errorPage');
});

// Defining some functions 
let {startServer} = require("./libs/utils")(app);
// Running the Server
if (require.main === module){
	// application run directly => start app server
	startServer();
} else {
	// application imported as a module via "require" => export function
	module.exports = startServer;
}




