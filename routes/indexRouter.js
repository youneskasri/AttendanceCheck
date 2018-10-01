const express = require('express'),
	router = express.Router();

const fs = require("fs"),
	appRootPath = require("app-root-path");
 
const winston = require("../config/winston");
const { playSoundIfVolumeOn } = require('../libs/utils')();

const scannerService = require("../services/scannerService");
const dataService = require("../services/dataService");
const authService = require("../services/authService");

/* Login & Logout */
router.get('/login', showLoginPage)
	.post('/login', handleLogin)
	.use('/logout', handleLogout);

router.use(setVolumeOnByDefault)
	.post('/volume', setVolume)
	.get('/', scannerService.indexQrScanner);

const { isLoggedIn } = authService;
router /* Protected Routes, Need Login */
	.get('/logs', isLoggedIn, showLogs)
	.get('/memory', isLoggedIn, getMemoryUsage)
	.get('/memory/graph', isLoggedIn, showMemoryUsageGraph)
	.get('/export/:format', isLoggedIn, dataService.exportDataToFormat);
	

function showLoginPage(req, res, next) { return res.render("login"); }
function handleLogin(req, res, next) {
	return passport.authenticate("local", {
        successRedirect: req.pathname,
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'You succesfully logged out !'
	})(req, res, next);
}

function handleLogout(req, res, next){
   req.logout();
   req.flash("success", "You succesfully logged out !");
   res.redirect("/");
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
	let logs = logsMatch.map(JSON.parse);
	return logs;
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


