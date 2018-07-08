const express = require('express'),
	router = express.Router(),
	fs = require("fs"),
	webp=require('webp-converter'),
	mongoose = require("mongoose");

const Employee = require("../models/employee");
const File = require("../models/file");
const Attendance = require("../models/attendance");

/*
* Text To Speech 
*/
const textToSpeech = require('../libs/utils')().textToSpeech;

console.log(textToSpeech);

/* GET home page. */
router.use((req, res, next)=>{
	if (!req.session.volume) req.session.volume = 'ON';
	res.locals.volume = req.session.volume;
	next();
}).get('/', scanner)
.post('/volume', setVolume)
.post('/attendance', createAttendance);


function setVolume(req, res, next){

	req.session.volume = req.body.volume;
	console.log("volume = " + req.session.volume);
	if (req.session.volume === 'ON') textToSpeech("Volume ON");
	return res.send({success: true, volume: req.session.volume});
}


function scanner(req, res, next) {
  if (req.session.volume === 'ON') textToSpeech("Welcome ! The application has started");
  return res.render('scanner');
}

function createAttendance(req, res, next){
	let text = req.body.content.replace("http://www.",''),
		//imageWebP = req.body.image,
		faceImagePNG = req.body.faceImage,
		imageURL = 'public/images/myImage.png'; 

/*	fs.writeFile(imageURL, faceImagePNG,
	  	function playSoundAndSendResponse(){
			imageURL = imageURL.replace("public/",'');
			if (req.session.volume === true)  textToSpeech(text);
			return res.send({ text, imageURL });
		});
*/
	let CIN = 'AD2135830';

	/* Search if employee exists */
	Employee.findOne({CIN: CIN})
	.populate('profileImage').exec()
	.then(employee => {
		console.log(employee.CIN.green)
		/* Save image file */
		File.create({
			creationDate: new Date(),
			contentType: 'image/png',
			data: faceImagePNG
		}).then(file => {
			/* Register attendance */
			Attendance.create({
				date: new Date(),
				faceImage: file._id
			}).then(attendance => {
				employee.attendances.push(attendance._id);
				textToSpeech("Welcome " + employee.firstName);
				return res.send({ employee, todaysImage: file.data})
			}).catch(printError);
		}).catch(printError);
	}).catch(printError);
}

function printError(err) { console.log("Error".green); console.log(err); }


module.exports = router;