const express = require('express'),
	router = express.Router();

const Employee = require("../models/employee");
const Attendance = require("../models/attendance");

const winston = require("../config/winston");

const { addToLocalsPromise, textToSpeech } = require('../libs/utils')();
const { handleError } = require("../libs/errors");


/* GET home page. */
router.use(setVolumeOnByDefault)
.post('/volume', setVolume)
.get('/', indexQrScanner);


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
	if (req.session.volume === 'ON') textToSpeech("Volume ON");
	return res.send({success: true, volume: req.session.volume});
}


/* @Index 
* - Charge les (3) dernièrs passages
* -- Pour chacun des passages, lui ajoute nom et prénom de l'employé
* - Charge le derniers passage avec l'image
* -- Lui ajoute l'employé avec son image de profil
*/
function indexQrScanner(req, res, next) {
  if (req.session.volume === 'ON') textToSpeech("Welcome ! The application has started");

  Attendance.findLastAttendances(3)
 	.then(addEmployeeInfoToAttendancesPromiseAll)
	.then(addToLocalsPromise(res, 'lastAttendances'))  
  	.then(Attendance.findLastAttendance)
	.then(addToLocalsPromise(res, 'lastAttendance'))
	.then(findAttendedEmployeeWithImage)
	.then(addToLocalsPromise(res, 'employee'))
	.then(() => res.render("scanner"))
	.catch(handleError(next));
}

function addEmployeeInfoToAttendancesPromiseAll(attendances) {
	/* For each attendance, add employees fname and lastname */
	let promises = getEachAttendedEmployeePromise(attendances);
	
	/* Quand j'ai trouvé les employees, assign them to their attendances */
	return Promise.all(promises).then(employeesNames => {
		return attendancesWithEmployee(attendances, employeesNames);
	});
}

/* @returns an Array of Promises */
function getEachAttendedEmployeePromise(attendances) {
	return attendances.map(att => {
		return Employee.findOne({ CIN: att.CIN }).select('firstName lastName').exec();
	});
}

function attendancesWithEmployee(lastAttendances, employeesNames) {
	return lastAttendances.map((attendance, i) => {
		attendance.employee = employeesNames[i];
		return attendance;
	});
}

function findAttendedEmployeeWithImage(lastAttendance) {
	if (!lastAttendance) return;
	return Employee.findAndPopulateImageByCIN(lastAttendance.CIN);
}

module.exports = router;