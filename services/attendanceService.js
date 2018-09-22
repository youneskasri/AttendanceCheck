const Employee = require("../models/employee");
const Attendance = require("../models/attendance");
const File = require("../models/file");

const { playSoundIfVolumeOn, addToLocalsPromise } = require('../libs/utils')();
const { handleAjaxError, handleError } = require("../libs/errors");
const winston = require("../config/winston");

const { addEmployeeInfoToAttendancesPromiseAll } = require("./scannerService"); // TODO refactor

/* @Index */
module.exports.allAttendances = (req, res, next) => {
	let { page, limit } = req.query;
	Attendance.pagination(Number(page), Number(limit))
	.then(addEmployeeInfoToAttendancesPromiseAll) 
	.then(addToLocalsPromise(res, "attendances"))
	.then(___ => calculateAttendancesPagination(page))
	.then(addToLocalsPromise(res, "pages"))
	.then(___ => res.render("attendances"))
	.catch(handleError(next));
}

function calculateAttendancesPagination(page) {

	return Attendance.count().exec()
	.then(attendancesCount => {
		let pageCount = Math.trunc((9+attendancesCount)/10); /* Assuming lmit is 9+1=10 per page */
		let pages = [];
		for (let i = 1; i <= pageCount; i++) {
			let pageNumber = i;
			let selected = pageNumber === Number(page);
			pages.push( { pageNumber, selected} );
		}
		return pages;
	});
}

/* @Show AJAX */
module.exports.showAttendance = (req, res) => {
	Attendance.findById(req.params.id)
	.populate('faceImage').exec()
	.then(linkEmployeeToAttendance)
	.then(attendanceWithEmployeeData => {
		res.send({ attendance: attendanceWithEmployeeData });
	}).catch(handleAjaxError(res));
}

function linkEmployeeToAttendance(attendance) {
	return Employee.findByCIN(attendance.CIN)
	.then(employee => {
		let attendanceWithEmployeeData = {
			CIN: employee.CIN,
			firstName: employee.firstName,
			lastName: employee.lastName,
			faceImage: attendance.faceImage,
			date: attendance.date
		};
		return attendanceWithEmployeeData;
	});
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
				pushAttendanceToEmployeeAttendances(employee, attendance)
				.then(() => {
					playSoundIfVolumeOn(req, "Welcome " + employee.firstName);
					return res.send({ attendance, employee, todaysImage: file.data });
				}).catch(handleAjaxError(res));
			}); // Error is handled well in the last catch block (y) (y)
	};
}

function pushAttendanceToEmployeeAttendances(employee, attendance) {
	let idAttendances = employee.attendances.slice();
	idAttendances.push(attendance._id);
	return Employee
		.findByIdAndUpdate({ _id: employee._id }, { attendances: idAttendances }, { new: false });
}

function registerAttendance(employee, imageId) {
	return Attendance.create({
		CIN: employee.CIN,
		date: new Date(),
		faceImage: imageId
	});
}

/* @Search */
module.exports.searchAndFilterAttendances = (req, res, next ) => {

	let { page, limit } = req.query;

	Attendance.pagination(page, limit)
	.then(addEmployeeInfoToAttendancesPromiseAll)
	.then(filterAttendances(req))
	.then(attendances => res.render("attendances", { attendances }))
	.catch(handleError(next));
}

function filterAttendances(req) {
	return attendances => {
		let { CIN, firstName, lastName, date } = req.query;
		let filteredAttendances = attendances.filter(ByCIN(CIN))
			.filter(ByFirstName(firstName))
			.filter(ByLastName(lastName))
			.filter(ByDate(date));
		return filteredAttendances;
	};
}

function ByCIN(CIN) {
	if (!CIN) return _ => true; /* SKIP¨*/
	return element => element.CIN.toUpperCase().includes(CIN.toUpperCase());
}

function ByFirstName(firstName) {
	if (!firstName) return _ => true; /* SKIP¨*/
	return element => element.employee.firstName.toUpperCase().includes(firstName.toUpperCase());
}

function ByLastName(lastName) {
	if (!lastName) return _ => true; /* SKIP¨*/
	return element => element.employee.lastName.toUpperCase().includes(lastName.toUpperCase());
}

const moment = require("moment");
function ByDate(date) {
	if (!date) return _ => true; /* SKIP¨*/
	return element => {
		let elementDate = moment(element.date).format('DD/MM/YYYY');
		return elementDate.includes(date);
	};
}