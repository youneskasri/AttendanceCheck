const express = require('express'),
	router = express.Router(), 
	passport = require("passport");
const fs = require("fs"),
	appRootPath = require("app-root-path");
const scannerService = require("../services/scannerService");
const dataService = require("../services/dataService");
const authService = require("../services/authService");
const winston = require("../config/winston");
const { playSoundIfVolumeOn } = require('../libs/utils')();
const { isLoggedIn } = authService;

/* Login & Logout */
router.get('/login', showLoginPage)
	.post('/login', handleLogin)
	.use('/logout', handleLogout);

router.use(isLoggedIn)
	.use(setVolumeOnByDefault)
	.post('/volume', setVolume)
	.get('/', scannerService.indexQrScanner)
	.get('/export/:format', dataService.exportDataToFormat);

router /* Protected Routes, Need Login */
	.get('/logs', isLoggedIn, showLogs)
	.get('/memory', isLoggedIn, getMemoryUsage)
	.get('/memory/graph', isLoggedIn, showMemoryUsageGraph);
	

function showLoginPage(req, res, next) { return res.render("login"); }

function handleLogin(req, res, next) {
	let successRedirect = req.session.redirectTo || '/';
	delete req.session.redirectTo;
	return passport.authenticate("local", {
        successRedirect,
        failureRedirect: "/login",
        failureFlash: "PASSWORD_OR_USERNAME_INCORRECT",
        successFlash: "AUTH_SUCCESS_MESSAGE"
	})(req, res, next);
}

function handleLogout(req, res, next){
   req.logout();
   req.flash("success", "LOGOUT_SUCCESS_MESSAGE");
   res.redirect("/login");
}

function setVolumeOnByDefault(req, res, next) {
	if (!req.session.volume) req.session.volume = 'ON';
	res.locals.volume = req.session.volume;
	next();
}

/**
 * TODO Handling AJAX Error 
 */
/* @SetVolume AJAX */
function setVolume(req, res){

	req.session.volume = req.body.volume;
	winston.info("volume = " + req.session.volume);
	playSoundIfVolumeOn(req, "VOLUME ON");
	return res.send({success: true, volume: req.session.volume});
}

/* @Index Logs */
function showLogs(req, res, next) {
	try {
		let logs = parseLogsFile();
		res.render("logs", { logs });
	} catch(e) {
		next(e);
	}
}

function parseLogsFile(fileLocation) {
	const logFileContent = fs.readFileSync(fileLocation || `${appRootPath}/logs/app.log`);
	let logsMatch = logFileContent.toString().match(/{"timestamp":.*,"level":.*,"message":.*}/g);
	let logs = logsMatch.map(parseJson);
	return logs;
}

function parseJson(log, i) {
	let result;
	try { 
		result=JSON.parse(log); 
	} catch(e) { 
		console.log('Error while parsing log number '+(i+1));
		result={message: `_______Cannot parse line ${i+1} in logs file_______`};
	}
	return result;
}

/* @GET memoryUsage Graph */
function showMemoryUsageGraph(req, res, next) {
	res.render("memory-usage-graph");
} 

const moment = require("moment");
/* @GET memory usage AJAX */
function getMemoryUsage(req, res) {
	let time = moment().format('hh:mm:ss');
	let memoryUsage = process.memoryUsage();
	res.send({ time, memoryUsage });
}


module.exports = router;


