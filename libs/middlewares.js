module.exports = function(app){
	
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
			const credentials = parseAndDecryptIfNecessary("credentials");
			console.log(credentials);
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

		setUpPassportAndFlash: function() {
			const passport = require('passport'),
				flash = require('connect-flash'),
				//LocalStrategy = require("passport-local"),
				User = require("../application/business/models/user");
			
			app.use(flash())
				.use(passport.initialize())
				.use(passport.session());

			passport.use(User.createStrategy());
			passport.serializeUser(User.serializeUser());
			passport.deserializeUser(User.deserializeUser());

			app.use(function(req, res, next){
				res.locals.currentUser = req.user;
				res.locals.success = req.flash('success');
				res.locals.error = req.flash('error');
				next();
			});

			return this;
		},

		setUpRouters: function () { /* Couplage Fort !! Need to Replace it */
			const indexRouter = require('../application/web/routes/indexRouter'),
				usersRouter = require('../application/web/routes/usersRouter'),
				employeesRouter = require('../application/web/routes/employeesRouter'),
				cardsRouter = require('../application/web/routes/cardsRouter'),
				attendancesRouter = require('../application/web/routes/attendancesRouter');
			app.use('/', indexRouter)
				.use('/attendances', attendancesRouter)
				.use('/users', usersRouter)
				.use('/cards', cardsRouter)
				.use('/employees', employeesRouter);
			return this;
		},

		setUpLoggers: function () {
			const winston = require('./winston');
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


function isEncrypted(fileData) {
	/* TODO */
	return false;
	const regex = /^\{.*\}/; // wrong regex for !jsonFormat
	return regex.test(fileData);
}

function parseAndDecryptIfNecessary(relativePathFromRoot) {
	const fs = require("fs");
	const crypto = require('crypto');
	const decipher = crypto.createDecipher('aes192', 'x0_func_003');
	const appRootPath = require("app-root-path");
	
	try {
		let filePath = appRootPath.toString()+'/'+relativePathFromRoot;
		let fileData = fs.readFileSync(filePath).toString();
	/*
		const input = fs.createReadStream(filePath);
		const output = fs.createWriteStream(new Buffer('')); 
		
		input.pipe(decipher).pipe(output);

		output.on('readable', () => {
			let chunk;
			while (null !== (chunk = readable.read())) {
			  console.log(`Received ${chunk.length} bytes of data.`);
			}
		});
		output.on('end', _ => process.exit(0)); */

		console.log("file Data", fileData);
		let decrypted = fileData;
		if (isEncrypted(fileData)) {
			decrypted = decipher.update(fileData, 'hex', 'utf8');
			console.log(true, decrypted);
		}
		console.log(false, 'credentials file is not encrypted');
		let jsonData = JSON.parse(decrypted);
		return jsonData; 
	} catch (e) {
		console.log(e);
		return null;
	}

}