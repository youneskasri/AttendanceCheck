const Employee = require("../models/employee");
const Attendance = require("../models/attendance");
const File = require("../models/file");

const { playSoundIfVolumeOn } = require('../libs/utils')();
const { handleAjaxError } = require("../libs/errors");
const winston = require("../config/winston");

/* @Index */
module.exports.allAttendances = (req, res, next) => {
	Attendance.findAllSortByIdDesc()
	.then(attendances => res.render("attendances", { attendances }))
	.catch(handleError(next));
}

/* @Show AJAX */
module.exports.showAttendance = (req, res) => {
	Attendance.findById(req.params.id)
	.populate('faceImage').exec()
	.then(attendance => {
		res.send({ attendance });
	}).catch(handleAjaxError(res));
}

/* @Create AJAX */
module.exports.createAttendance = (req, res) => {
	let text = req.body.content.replace("http://www.",''),
		faceImagePNG = req.body.faceImage;

	let CIN = 'AD213583';

	/* Search if employee exists */
	Employee.findAndPopulateImageByCIN(CIN)
		.then(employee => {
			if (!employee) throw new Error("Employee not found");
			winston.info(employee.CIN.green);
			return File.saveImageFile(faceImagePNG) /* Save image file */
			.then(registerAttendanceAndSendResponse(employee, req, res));
		})
		.catch(handleAjaxError(res));
}


function registerAttendanceAndSendResponse(employee, req, res) {
	return file => {
		return registerAttendance(employee, file._id) /* Register attendance */
			.then(attendance => {
				playSoundIfVolumeOn(req, "Welcome " + employee.firstName);
				return res.send({ attendance, employee, todaysImage: file.data });
			}); // Error is handled well in the last catch block (y) (y)
	};
}

function registerAttendance(employee, imageId) {
	return Attendance.create({
		CIN: employee.CIN,
		date: new Date(),
		faceImage: imageId
	});
}

