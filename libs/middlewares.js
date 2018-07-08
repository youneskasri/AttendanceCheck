module.exports = function(app){

	const express = require("express"),
		path = require('path');

	return middlewares = {
		setUpHandlebars: ()=>{
			const handlebars = require("express-handlebars");
			app.engine('.hbs', handlebars({ 
				defaultLayout: null, extname: '.hbs' ,
				helpers: {cond: require("handlebars-cond").cond}
			})).set("view engine", "hbs");
			return middlewares;
		},

		setUpJsonParser: ()=>{
			const bodyParser = require("body-parser");
			app.use(bodyParser.json({limit:1024*1024*20}))
				.use(bodyParser.urlencoded({ extended: false, limit:1024*1024*20 }));
			return middlewares;
		},

		setUpSession: ()=>{
			const session = require("express-session");
			const credentials = require("../credentials");
			app.use(session({
				secret: credentials.cookieSecret,
				/* to remove deprecation warning see :
				* https://github.com/expressjs/session#options before launch */
				resave: false,
				saveUninitialized: true
			}));
			return middlewares;
		},

		setUpRouters: ()=>{
			const indexRouter = require('../routes/index'),
				usersRouter = require('../routes/users'),
				employeesRouter = require('../routes/employees');
			app.use('/', indexRouter)
				.use('/users', usersRouter)
				.use('/employees', employeesRouter);
			return middlewares;
		},

		setUpLogger: ()=>{
			const logger = require('morgan')
			app.use(logger('dev'));
			return middlewares;
		}

	};
}