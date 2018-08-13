const Employee = require("../models/employee");
const Attendance = require("../models/attendance");
const File = require("../models/file");

const textToSpeech = require('../libs/utils')().textToSpeech;

let { handleAjaxError } = require("../libs/errors");

/* AJAX */
module.exports.showAttendance = (req, res, next) => {
	Attendance.findById(req.params.id)
	.populate('faceImage').exec()
	.then(attendance => {
		res.send({ attendance });
	}).catch(err => handleAjaxError(err, req, res));
}

/* AJAX */
module.exports.createAttendance = (req, res, next) => {
	let text = req.body.content.replace("http://www.",''),
		faceImagePNG = req.body.faceImage,
		imageURL = 'public/images/myImage.png'; 

	let CIN = 'AD213583';

	/* Search if employee exists */
	Employee.findAndPopulateImageByCIN(CIN)
	.then(employee => {
		if (!employee) throw new Error("Employee not found");
		console.log(employee.CIN.green)
		/* Save image file */
		File.create({
			creationDate: new Date(),
			contentType: 'image/png',
			data: faceImagePNG
		}).then(file => {
			/* Register attendance */
			Attendance.create({
				CIN: employee.CIN,
				date: new Date(),
				faceImage: file._id
			}).then(attendance => {
				textToSpeech("Welcome " + employee.firstName);
				return res.send({ attendance, employee, todaysImage: file.data});

			}).catch(err => handleAjaxError(err, req, res));
		}).catch(err => handleAjaxError(err, req, res));
	}).catch(err => handleAjaxError(err, req, res));
}

