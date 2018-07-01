const express = require('express'),
	https = require('https'),
	path = require('path'),
	fs = require('fs'),
	logger = require('morgan'),
	createError = require('http-errors');

const indexRouter = require('./routes/index'),
	usersRouter = require('./routes/users');

const app = express();
	app.set("port", process.env.PORT || 8443)
	.disable("x-powered-by");

/* View engine */
const handlebars = require("express-handlebars");
app.engine('.hbs', handlebars({ defaultLayout: null, extname: '.hbs' }))
	.set("view engine", "hbs")
	.use(express.static(__dirname + "/public"));

/* Favicon */
const favicon = require('express-favicon');
app.use(favicon(__dirname + '/public/favicon.png'));

app.use(logger('dev'));

// JSON Parser, need it for AJAX
const bodyParser = require("body-parser");
app.use(bodyParser.json({limit:1024*1024*20}))
	.use(bodyParser.urlencoded({ extended: false, limit:1024*1024*20 }))
	.use(express.static(path.join(__dirname, 'public')));


/** Error Handler For DEV env */
if ( app.get("env") === "development"){
	if (process.env.NODE_ENV === 'development') {
		const errorHandler = require("errorhandler");
		// only use in development 
		app.use(errorHandler());
	}
}
	

app.use('/', indexRouter)
	.use('/users', usersRouter);


// catch 404 and error handler
app.use(function(req, res, next) {
	next(createError(404));
}).use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	// render the error page
	res.status(err.status || 500);
	console.log(err);
	res.render('error');
});


// Running the Server
if (require.main === module){
	// application run directly => start app server
	startServer();
} else {
	// application imported as a module via "require" => export function
	module.exports = startServer;
}



function startServer(){
	/* HTTPS ceritificate */
	let options = {
	  key: fs.readFileSync('./key.pem'),
	  cert: fs.readFileSync('./certificate.crt')
	}
	/* Listen + affiche liste des routes (sans middlawares) */
	let server = https.createServer(options, app).listen(app.get("port"), function(){
		console.log("Express started in "+ app.get("env") +" mode on https://localhost:"+app.get("port")+"; Press Crtl-C to terminate. ");
		/*
		*	Liste des routes ( sans middlewares )
		*/
		showRoutesInConsole();
		/*
		*	Show an OS notification message
		*/
		if (app.get("env") === "development"){
			const notifier = require('node-notifier');
			notifier.notify("Express started in "+ app.get("env") +" mode on https://localhost:"+app.get("port")+"; Press Crtl-C to terminate. ");	
		}
	});	
}

/** Not working, need to adjust */
function showRoutesInConsole(){
	app._router.stack.forEach(function(r){
		if (r.route){
			//console.log(r.route);
			let path = r.route.path;
			let m = r.route.methods;
			let methods="";
			if (m.get) methods += "GET ";
			if (m.post) methods += "POST";
			console.log(methods+"\t"+path);
		}
	});
};
