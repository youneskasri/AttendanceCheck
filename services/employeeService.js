const Employee = require("../models/employee");
const File = require("../models/file");
const Attendance = require("../models/attendance");

const { filterEmployeesByKeyword, printEmployees } = Employee;
const { playSoundIfVolumeOn, addToLocalsPromise } = require('../libs/utils')();
const { handleAjaxError, handleError, printError } = require("../libs/errors");
const { addEmployeeInfoToAttendancesPromiseAll } = require("./scannerService");

const winston = require("../config/winston");

const moment = require("moment");

const NB_LAST_ATTENDANCES = 30;

/* @Index */
module.exports.allEmployees = (req, res, next) => {

	let startTime = new Date();
	Employee.findAllAndPopulateImage()
	.then(employees =>{		
		// printEmployees(employees);
		playSoundIfVolumeOn(req, "List of employees");
		winston.info("Treatment time : " + (new Date() - startTime));
		return res.render("employees", { employees });
	}).catch(handleError(next));
};


/* @Search */
module.exports.searchEmployees = (req, res, next) => {

	/* Remplacer les espaces multiples par ' ', puis trim() */
	let q = req.query.q.replace(/\s{2,}/g, ' ').trim();

	Employee.findAllAndPopulateImage()
	.then(filterEmployeesByKeyword(q))
	.then(employees => {
		playSoundIfVolumeOn(req, "Search results");
		return res.render("employees", { employees, query : q });	
	}).catch(handleError(next));
};

/* @Show */
module.exports.showEmployee = (req, res, next) => {
	Employee.findByIdAndPopulateImage(req.params.id)
	.then(addLastAttendancesToEmployee)
	.then(playShowEmployeeSound(req))
	.then(employee => res.render("show-employee", { employee }))
	.catch(handleError(next));
};

function addLastAttendancesToEmployee(employee) {

	return Attendance.findLastAttendancesByCIN(NB_LAST_ATTENDANCES, employee.CIN)
	.then(attendances => {
		employee.attendances = attendances;
		return employee;
	});
}

function playShowEmployeeSound(req) {
	return (employee) => { 
		playSoundIfVolumeOn(req, employee.firstName + "'s profile"); return employee; 
	};
}

/* @Create AJAX */
module.exports.createEmployee = (req, res) => {

	validateInputsAndSaveEmployee(req.body)
	.then(savedEmployee => {
		winston.info('Saved in DB: '.green + savedEmployee._id);
		res.send({success: true, employee: savedEmployee});
	})
	.catch(sendErrorAjax(res)); 
};

function validateInputsAndSaveEmployee(employeeForm) {
	return Employee.create({
		CIN: employeeForm.CIN,
		firstName: employeeForm.firstName,
		lastName: employeeForm.lastName,
		birthDate: employeeForm.birthDate,
		phoneNumber: employeeForm.phoneNumber
	});
}

function sendErrorAjax(res) {
	return err => {
		printError(err);
		res.send({ error: err });
	};
}

/* @ProfileImage AJAX */
module.exports.setProfileImage = (req, res) => {

	winston.info("setProfileImage");
	let imageFile = req.body.image;	
	let idEmployee = req.body.idEmployee;
	File.saveImageFile(imageFile)
		.then(updateProfileImage(idEmployee))
		.then(image => res.send({ success: true, image }))
		.catch(handleAjaxError(res));
};

function updateProfileImage(idEmployee) {
	return createdFile => {
		winston.info('Update profile image for ' + idEmployee);
		return Employee.findByIdAndUpdate({ _id: idEmployee }, { profileImage: createdFile._id }, { new: false })
			.exec()
			.then(deleteOldImageIfExists) /* Error is handled well in the last catch block */
			.then(() =>  Employee.findByIdAndPopulateImage(idEmployee))
			.then(employee => employee.profileImage);
	};
}


function deleteOldImageIfExists(oldEmployee){
	if (oldEmployee.profileImage){
		return File.findByIdAndRemove({_id: oldEmployee.profileImage})
		.exec();	/* Error is Handled well in the last CATCH Block (y) */
	} else {
		winston.info("No previous image file");
	}	
}


/* @Calendar AJAX */
module.exports.getCalendar = (req, res) => {

	const idEmployee = req.params.id;
	currentMonthAttendances(idEmployee)
		.then(formatAttendancesForCalendar)
		.then(calendarData => res.send({ calendarData }))
		.catch(handleAjaxError(res));
};


function currentMonthAttendances(idEmployee) {

	return getEmployeeCIN(idEmployee)
		.then(CIN => Attendance.currentMonthAttendances(CIN));
}

function getEmployeeCIN(idEmployee) {
	return Employee.findById(idEmployee).exec()
		.then(employee => employee.CIN);
}

function formatAttendancesForCalendar(attendances) {
	/* {date: yyyy-mm-dd, badge: boolean, title: string, body: string, footer: string, classname: string} */
	return attendances.map(formatAttendanceForCalendar);
}

function formatAttendanceForCalendar(attendance) {
	let date = moment(attendance.date).format('YYYY-MM-DD');
	let badge = true;
	let title = 'Attended ' + moment(attendance.date).format('DD/MM/YYYY at HH:mm:s');
	let body = attendance._id;	let footer = '';
	let classname = ''; // 'table-success';
	
	return {date, badge, title, body, footer, classname};
}

module.exports.generateAttendancesReport = (req, res, next) => {
	const idEmployee = req.params.id;
	Employee.findByIdAndPopulateImage(idEmployee)
		.then(addToLocalsPromise(res, 'employee'))
		.then(___ => currentMonthAttendancesWithImages(idEmployee))
		.then(addToLocalsPromise(res, 'attendances'))
		.then(___ => res.render("attendances-report"))
		.catch(handleError(next));
};

function currentMonthAttendancesWithImages(idEmployee) {

	return getEmployeeCIN(idEmployee)
		.then(CIN => Attendance.currentMonthAttendancesWithImages(CIN));
}