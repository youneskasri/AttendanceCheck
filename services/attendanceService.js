const Employee = require("../models/employee");
const Attendance = require("../models/attendance");
const File = require("../models/file");
const moment = require("moment");

const { playSoundIfVolumeOn, addToLocalsPromise } = require('../libs/utils')();
const { handleAjaxError, handleError } = require("../libs/errors");
const winston = require("../config/winston");

const { addEmployeeInfoToAttendancesPromiseAll } = require("./scannerService"); // TODO refactor

/* @Index */
module.exports.allAttendances = (req, res, next) => {
	let { page, limit } = req.query;
	/* Pages fl Front end mn  1 --> 7 et ici mn 0 --> 6 */
	page = page - 1;
	Attendance.pagination(Number(page), Number(limit))
	.then(addEmployeeInfoToAttendancesPromiseAll) 
	.then(addToLocalsPromise(res, "attendances"))
	.then(___ => calculateAttendancesPagination(page))
	.then(addToLocalsPromise(res, "pages"))
	.then(___ => res.render("attendances"))
	.catch(handleError(next));
};

module.exports.allAttendancesAsync = async (req, res, next) => {
	let { page, limit } = req.query;
	page = page - 1; 	/* Pages fl Front end mn  1 --> 7 et ici mn 0 --> 6 */
	let attendances = await Attendance.pagination(Number(page), Number(limit));
	attendances = await addEmployeeInfoToAttendancesPromiseAll(attendances);
	let pages = await calculateAttendancesPagination(page)
	res.render("attendances", { attendances, pages });
}

function calculateAttendancesPagination(page) {

	return Attendance.count().exec()
	.then(attendancesCount => {
		let pageCount = Math.trunc(attendancesCount/10);
		if (attendancesCount%10>0) pageCount++;
		let pages = [];
		let thereIsASelectedPage = false;
		for (let pageNumber = 0; pageNumber < pageCount; pageNumber++) {
			let selected = pageNumber === Number(page);
			if (selected===true) thereIsASelectedPage = true;
			let textContent = pageNumber+1;
			pages.push( { pageNumber, textContent, selected} );
		}
		if (!thereIsASelectedPage)
			pages[0].selected=true;
			
		return pages;
	});
}

/* @Show AJAX */
module.exports.showAttendance = (req, res) => {
	Attendance.findById(req.params.id)
	.populate('faceImage').exec()
	.then(linkEmployeeToAttendance)
	.then(attendanceWithEmployeeData => {
		res.send({ success: true, attendance: attendanceWithEmployeeData });
	}).catch(handleAjaxError(res));
};

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
};


function registerAttendanceAndSendResponse(employee, req, res) {
	return file => {
		return registerAttendance(employee, file._id) /* Register attendance */
			.then(attendance => {
				pushAttendanceToEmployeeAttendances(employee, attendance)
				.then(() => {
					playSoundIfVolumeOn(req, "Welcome " + employee.firstName);
					return res.send({ attendance, employee, todaysImage: file.data, success: true });
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

	// let { page, limit } = req.query;

	Attendance.findAllSortByIdDesc()
	.then(addEmployeeInfoToAttendancesPromiseAll)
	.then(filterAttendances(req))
	.then(addToLocalsPromise(res, "attendances"))
	//.then(___ => calculateAttendancesPagination(page))
	//.then(addToLocalsPromise(res, "pages"))
	.then(___ => res.render("attendances"))
	.catch(handleError(next));
};

function addToQueryString(queryObj) {
	let { CIN, firstName, lastName, date } = queryObj;
	let querystring = `&CIN=${CIN}&firstName=${firstName}&lastName=${lastName}&date=${date}`;
	return querystring;
}

module.exports.searchAndFilterAttendancesAwait = async (req, res, next) => {
	const { page, limit } = req.query;
	try {
		let attendances = await Attendance.pagination(Number(page), Number(limit));
		let attendancesWithEmployee = await addEmployeeInfoToAttendancesPromiseAll(attendances);
		let filteredAttendances = filterAttendances(req)(attendancesWithEmployee);
		res.render("attendances", { attendances: filteredAttendances });
	} catch (e) {
		handleError(next)(e);
	}
};

module.exports.searchAndFilterAttendancesAwait2 = async (req, res, next) => {
	let attendances = await getFilteredAttendances(req);
	res.render("attendances", { attendances });
};

async function getFilteredAttendances(req) {
	const { page, limit } = req.query;
	let attendances = await Attendance.pagination(Number(page), Number(limit));
	let attendancesWithEmployee = await addEmployeeInfoToAttendancesPromiseAll(attendances);
	return filterAttendances(req)(attendancesWithEmployee);
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

function ByDate(date) {
	if (!date) return _ => true; /* SKIP¨*/
	return element => {
		let elementDate = moment(element.date).format('DD/MM/YYYY');
		return elementDate.includes(date);
	};
}