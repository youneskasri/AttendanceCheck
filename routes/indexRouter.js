const express = require('express'),
	router = express.Router();

const Employee = require("../models/employee");
const Attendance = require("../models/attendance");
const winston = require("../config/winston");

/*
* Text To Speech 
*/
const textToSpeech = require('../libs/utils')().textToSpeech;


/* GET home page. */
router.use(setVolumeOnByDefault)
.get('/', indexQrScanner)
.post('/volume', setVolume);


function setVolumeOnByDefault(req, res, next) {
	if (!req.session.volume) req.session.volume = 'ON';
	res.locals.volume = req.session.volume;
	next();
}

/* @SetVolume AJAX */
function setVolume(req, res, next){

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
      }).catch(next);
  	})
  	.then(Attendance.findLastAttendance)
  	.then(lastPersonChecked => {
  		if (!lastPersonChecked) {
  			winston.info("Mazal ma tsejel 7ta attendance");
  			return res.render('scanner');
  		}
  		return Employee.findAndPopulateImageByCIN(lastPersonChecked.CIN)
  		.then(employee => {
  			return res.render('scanner', { lastPersonChecked, employee });
  		});
  	})
 	.catch(next);
}

module.exports = router;