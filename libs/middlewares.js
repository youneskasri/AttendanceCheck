const helpers = require("helpers-younes");

module.exports = function(app){
	
	const middlewares = {
		setUpHandlebars: function (ext = 'hbs') {
			const exphbs = helpers.setUpHandlebars();
			app.engine(ext, exphbs).set('view engine', ext);
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

		setUpPassportAndFlash: function(userModelPath = "../application/business/models/user") {
			const User = require(userModelPath);
			helpers.setUpAuthAndFlash(app, User);
			return this;
		},

		setUpRouters: function (routesFolderPath = '../application/web/routes') { 
			const routers = require(routesFolderPath);
			Object.keys(routers).forEach(prefix => app.use(prefix, routers[prefix]));
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