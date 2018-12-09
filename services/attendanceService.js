const moment = require("moment");
const winston = require("../config/winston");
const Employee = require("../models/employee");
const Attendance = require("../models/attendance");
const File = require("../models/file");
const { playSoundIfVolumeOn } = require('../libs/utils')();

/* @Index */
module.exports.allAttendances = async (req, res, next) => {
	let { page, limit } = req.query;
	page = page - 1; 	/* Pages fl Front end mn  1 --> 7 et ici mn 0 --> 6 */
	let attendances = await Attendance.pagination(Number(page), Number(limit));
	attendances = await Employee.addEmployeeInfoToAttendancesPromiseAll(attendances);
	let pages = await calculateAttendancesPagination(page)
	res.render("attendances", { attendances, pages });
	if (!page) playSoundIfVolumeOn(req, "History of attendances");
}

function calculateAttendancesPagination(currentPage) {
	return Attendance.count().exec()
	.then(attendancesCount => getAttendancesPages({ attendancesCount, currentPage }));
}

function getAttendancesPages({ attendancesCount, currentPage }) {
	let pageCount = Math.trunc(attendancesCount/10);
	if (attendancesCount%10>0) pageCount++;
	let pages = [];
	let thereIsASelectedPage = false;
	for (let pageNumber = 0; pageNumber < pageCount; pageNumber++) {
		let selected = pageNumber === Number(currentPage);
		if (selected===true) thereIsASelectedPage = true;
		let textContent = pageNumber+1;
		pages.push( { pageNumber, textContent, selected} );
	}
	if (!thereIsASelectedPage && pages.length>0)
		pages[0].selected=true;
		
	return pages;
}

/* @Show AJAX */
module.exports.showAttendance = async (req, res, next) => {
	let attendance = await Attendance.findById(req.params.id)
		.populate('faceImage').exec();
	attendance = await linkEmployeeToAttendance(attendance);
	res.send({ success: true, attendance });
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
module.exports.createAttendance = async (req, res, next) => {
	let faceImagePNG = req.body.faceImage;
	let CIN = req.body.content;
	
	/* HARD CODED for TESTS */
	if (CIN.includes('www.')) 
		CIN = 'AD213583';

	/* Search if employee exists */
	let employee = await Employee.findAndPopulateImageByCIN(CIN);
	if (!employee) throw new Error("EMPLOYEE_NOT_FOUND");
	winston.info(employee.CIN.green);
	/* Save Image File, And Register Attendance */
	let file = await File.saveImageFile(faceImagePNG);
	let attendance = await registerAttendance(employee, file._id);
	await saveAttendanceToEmployee(employee, attendance);
	/* Send Response */
	playSoundIfVolumeOn(req, "Welcome " + employee.firstName);
	return res.send({ attendance, employee, todaysImage: file.data, success: true });				
};


function saveAttendanceToEmployee(employee, attendance) {
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
module.exports.searchAndFilterAttendances = async (req, res, next) => {
	let { page, limit } = req.query;
	page = page - 1; 	/* Pages fl Front end mn  1 --> 7 et ici mn 0 --> 6 */

	let { CIN , date, firstName, lastName } = req.query;
	let attendances = await Attendance.findAllSortByIdDesc();
	attendances = attendances.filter(ByCIN(CIN))
		.filter(ByDate(date));

	attendances = await Employee.addEmployeeInfoToAttendancesPromiseAll(attendances);
	attendances = attendances.filter(ByFirstName(firstName))
		.filter(ByLastName(lastName));
	
	let pages = getAttendancesPages({ attendancesCount: attendances.length, currentPage: page });

	/* Skip & Limit */ 
	if (!page || page < 0) page = 0;
	if (!limit) limit = 10;
	let startIndex = page * limit;
	 endIndex = startIndex + limit;
	attendances = attendances.slice(startIndex, endIndex);

	console.log( CIN , date, firstName, lastName);
	CIN = CIN || '', firstName = firstName || '', lastName = lastName || '', date = date || '';
	/* &CIN=&firstName=&lastName=&date= */
	let queryStringParams = `&CIN=${CIN}&firstName=${firstName}&lastName=${lastName}&date=${date}`;
	res.render("attendances", { attendances, pages, 
		CIN, firstName, lastName, date,
		queryStringParams, pathSuffix: '/search'});
};

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