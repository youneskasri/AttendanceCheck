module.exports = function(app){

	const express = require("express"),
		path = require('path');

	const middlewares = {
		setUpHandlebars: function () {
			const exphbs = require("exphbs");
			const cond = require("handlebars-cond").cond;
			const dateFormat = require("handlebars-dateformat");

			let handlebars = exphbs.handlebars;
			handlebars.registerHelper('cond', cond);
			handlebars.registerHelper('dateFormat', dateFormat);

			app.engine('hbs', exphbs);
			app.set('view engine', 'hbs');
			return this;
		},

		setUpJsonParser: function () {
			const bodyParser = require("body-parser");
			app.use(bodyParser.json({limit:1024*1024*20}))
				.use(bodyParser.urlencoded({ extended: false, limit:1024*1024*20 }));
			return this;
		},

		setUpSession: function (mongoose) {
			const session = require("express-session");
			const MongoStore = require('connect-mongo')(session);
			const credentials = require("../credentials");
			app.use(session({
				secret: credentials.cookieSecret,
				store: new MongoStore({	mongooseConnection: mongoose.connection }),
				/* to remove deprecation warning see :
				* https://github.com/expressjs/session#options before launch */
				resave: false,
				saveUninitialized: true
			}));
			return this;
		},

		setUpRouters: function () {
			const indexRouter = require('../routes/indexRouter'),
				usersRouter = require('../routes/usersRouter'),
				employeesRouter = require('../routes/employeesRouter'),
				cardsRouter = require('../routes/cardsRouter'),
				attendancesRouter = require('../routes/attendancesRouter');
			app.use('/', indexRouter)
				.use('/attendances', attendancesRouter)
				.use('/users', usersRouter)
				.use('/cards', cardsRouter)
				.use('/employees', employeesRouter);
			return this;
		},

		setUpLoggers: function () {
			const winston = require('../config/winston');
			const morgan = require('morgan');
			if ( app.get("env") === "development"){
				app.use(morgan('dev'));
			} else {
				app.use(morgan(/*'combined'*/ 'short', { stream: winston.stream }));
			}			
			return this;
		}

	};

	return middlewares;
}