const fs = require("fs");
const appRootPath = require("app-root-path");    
const winston = require("../../../libs/winston");
const { playSoundIfVolumeOn } = require("../../../libs/utils")();
const moment = require("moment");

exports.setVolumeOnByDefault = (req, res, next) => {
	if (!req.session.volume) req.session.volume = 'ON';
	res.locals.volume = req.session.volume;
	next();
}

/* @SetVolume AJAX */
exports.setVolume = (req, res) => {
	req.session.volume = req.body.volume;
	winston.info("volume = " + req.session.volume);
	playSoundIfVolumeOn(req, "VOLUME ON");
	return res.send({success: true, volume: req.session.volume});
}

/* @Index Logs */
exports.showLogs = (req, res, next) => {
	let logs = parseLogsFile();
	res.render("logs", { logs });
}

function parseLogsFile(fileLocation) {
	const logFileContent = fs.readFileSync(fileLocation || `${appRootPath}/logs/app.log`);
	let logsMatch = logFileContent.toString().match(/{"timestamp":.*,"level":.*,"message":.*}/g);
	if (!logsMatch) return [];
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
exports.showMemoryUsageGraph = (req, res, next) => {
	res.render("memory-usage-graph");
} 

/* @GET memory usage AJAX */
exports.getMemoryUsage = (req, res) => {
	let time = moment().format('hh:mm:ss');
	let memoryUsage = process.memoryUsage();
	res.send({ time, memoryUsage });
}
