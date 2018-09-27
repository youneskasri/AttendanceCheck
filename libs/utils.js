module.exports = function(app) {

	const fs = require("fs");
	const https = require("https");
	
	const SimpleTTS = require("simpletts");
	const tts = new SimpleTTS();
	const winston = require('../config/winston');

	return {

		showMemoryUsage: (interval) => {
			let printInterval = interval || 5000;
			setInterval(() => {
				let memoryUsage = process.memoryUsage();
				let { rss, heapTotal, heapUsed } = memoryUsage;
				console.log(`rss=${rss}, heapUsed=${heapUsed/1024/1024} mb`);
			}, printInterval);
		},

		isDevEnvironment : (appArg) => {
			let application = app || appArg;
			if (!application) throw new Error("App object is undefined #isDevEnvironment");
			return application.get("env") === "development";
		},

		useErrorHandler: (appArg) => {
			let application = app || appArg;
			if (!application) throw new Error("App object is undefined #isDevEnvironment");
			let errorHandler = require("errorhandler");
			application.use(errorHandler());
		},

		addToLocalsPromise: (res, name) => {
			return (objectToAdd) => {
				res.locals[name] = objectToAdd;
				return objectToAdd;
			}
		},

		/** Not working, need to adjust */
		showRoutesInConsole: ()=>{
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
		},

		startServer: function () {
			/* Test With Http */
			let port = app.get("port")
			if (port != 8443 && port != 443) {
				winston.info("Using HTTP");
				return app.listen(port, _ => console.log("The application has started on http://localhost:"+port));
			}
			/* HTTPS certificate */
			let options = {
			  key: fs.readFileSync('./key.pem'),
			  cert: fs.readFileSync('./certificate.crt')
			}
			/* Listen + affiche liste des routes (sans middlawares) */
			let server = https.createServer(options, app).listen(app.get("port"), function(){
				winston.info("Express started in "+ app.get("env") +" mode on https://localhost:"+app.get("port")+"; Press Crtl-C to terminate. ");
				/*
				*	Liste des routes ( sans middlewares )
				*/
				this.showRoutesInConsole();
				/*
				*	Show an OS notification message
				*/
				if (app.get("env") === "development"){
					const notifier = require('node-notifier');
					notifier.notify("Express started in "+ app.get("env") +" mode on https://localhost:"+app.get("port")+"; Press Crtl-C to terminate. ");	
				}
			});	
		},

		textToSpeech: (text, res) => {
			tts.read({ text })
			.then(() => {
				if (!res) return;
			  	res.end(text);
			}).catch(err => winston.warn(err.message.yellow));
		},

		playSoundIfVolumeOn: (req, text) => {
			if (req.session.volume === 'ON') {
				tts.read({ text })
				.catch(err => winston.warn(err.message.yellow));
			}
		}
	
	};
}
