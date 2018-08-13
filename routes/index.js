const express = require('express'),
	router = express.Router(),
	mongoose = require("mongoose");

const Employee = require("../models/employee");
const Attendance = require("../models/attendance");

const attendanceService = require("../services/attendance-service");

/*
* Text To Speech 
*/
const textToSpeech = require('../libs/utils')().textToSpeech;


/* GET home page. */
router.use(setVolumeOnByDefault)
.get('/', indexQrScanner)
.post('/volume', setVolume)
.get('/attendances/:id', attendanceService.showAttendance)
.post('/attendance', attendanceService.createAttendance);


function setVolumeOnByDefault(req, res, next) {
	if (!req.session.volume) req.session.volume = 'ON';
	res.locals.volume = req.session.volume;
	next();
}
/* @SetVolume AJAX */
function setVolume(req, res, next){

	req.session.volume = req.body.volume;
	console.log("volume = " + req.session.volume);
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
  	.then(lastAttendances => {
      /* For each attendance, add employees fname and lastname */
      let promises = lastAttendances.map(att =>{
        return Employee.findOne({CIN: att.CIN}).select('firstName lastName').exec();
      });
      /* Quand j'ai trouvé les employees, assign them to their attendances */
      Promise.all(promises).then(employeesNames => {          
          let attendances = lastAttendances
          .map((attendance, i) => {
            attendance.employee = employeesNames[i];
            return attendance;
          });

          res.locals.lastAttendances = attendances;
          console.log("last attendances ", attendances);
      }).catch(next);
  	})
  	.then(Attendance.findLastAttendance)
  	.then(lastPersonChecked => {
  		if (!lastPersonChecked) {
  			console.log("Mazal ma tsejel 7ta attendance");
  			return res.render('scanner');
  		}
  		Employee.findAndPopulateImageByCIN(lastPersonChecked.CIN)
  		.then(employee => {
  			res.locals.lastPersonChecked = lastPersonChecked;
  			res.locals.employee = employee;
  			console.log("Last Person Checkec . employee = ");
  			return res.render('scanner');
  		})
  		.catch(next);
  	})
 	.catch(next);
}

module.exports = router;