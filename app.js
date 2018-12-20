const express = require('express'),
	createError = require('http-errors'),
	mongoose = require('mongoose'),
	User = require("./application/business/models/user");

const colors = require('colors');
const winston = require("./libs/winston");

/* connect database */
let mongooseOpts = { keepAlive: 120 };
mongoose.connect('mongodb://localhost:27017/attendance-check', mongooseOpts)
.then(() => winston.info(`Database connected`))
.catch(err => { 
	let message = `Database connection error: ${err.message}`;
	winston.error(message);	console.log(message); process.exit(1);
});

//require("./seeds").insertRandomEmployees(10); // Seeds

/* App settings */
const app = express()
	.set("port", process.env.PORT || 4000 || 8443)
	.set("env", process.env.NODE_ENV || "development")
	.disable("x-powered-by");

/* require some utilities functions */
const { isDevEnvironment, 
	showMemoryUsage, 
	useErrorHandler,
	startServer } = require("./libs/utils")(app);

/* Favicon, views and public folders */
const favicon = require('express-favicon');
app.use(express.static(__dirname + "/public"));
app.use(favicon(__dirname + '/public/favicon.png'));
app.set('views', `${__dirname}/application/views`);

const linkMiddlewaresTo = require("./libs/middlewares");
linkMiddlewaresTo(app).setUpHandlebars() // View engine
	.setUpJsonParser() // JSON Parser
	.setUpSession(mongoose) // Session
	.setUpPassportAndFlash() // Passport Auth & Flash Msg
	.setUpLoggers() // Loggers
	.setUpRouters(); // Routes


if ( isDevEnvironment()){
	useErrorHandler(); // sends the full error stack to errorPage
	showMemoryUsage();
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

// Running the Server
if (require.main === module){
	// application run directly => start app server
	startServer();
} else {
	// application imported as a module via "require" => export function
	module.exports = startServer;
}

createAdminAccountIfNotExists();

function createAdminAccountIfNotExists() {

	console.log("createAdminAccountIfNotExists");
	User.count({ username: "admin" }, function (err, count) {
		if (err) return console.error(err);
		if (count < 1) {
			console.log("count < 1");
			User.register({ username: "admin"}, "champloo", 
			(err, savedUser) => {
				if (err) console.error(err);
				else console.log(savedUser.username + ' saved !');
			});
		} else console.log("count >= 1");
	});
}