module.exports = function(app) {

	const fs = require("fs");
	const https = require("https");

	/* I used obj to avoid using this b/c js has no block scope */
	return obj = {

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

		startServer: ()=>{
			/* HTTPS certificate */
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
				obj.showRoutesInConsole();
				/*
				*	Show an OS notification message
				*/
				if (app.get("env") === "development"){
					const notifier = require('node-notifier');
					notifier.notify("Express started in "+ app.get("env") +" mode on https://localhost:"+app.get("port")+"; Press Crtl-C to terminate. ");	
				}
			});	
		}

	};
}