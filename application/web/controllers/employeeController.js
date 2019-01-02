const Employee = require("../../business/models/employee");
const File =  require("../../business/models/file");
const Attendance =  require("../../business/models/attendance");
const winston = require("../../../libs/winston");
const moment = require("moment");

const { filterEmployeesByKeyword, printEmployees } = Employee;
const { playSoundIfVolumeOn } = require("../../../libs/utils")();
const getErrorMessageI18N = require("./errorMessagesI18N");

/* @Index */
exports.allEmployees = async (req, res, next) => {

	let employees = await Employee.findAllAndPopulateImage()
	playSoundIfVolumeOn(req, "List of employees");
	return res.render("employees", { employees });
};

/* @Search */
exports.searchEmployees = async (req, res, next) => {

	/* Remplacer les espaces multiples par ' ', puis trim() */
	let q = req.query.q.replace(/\s{2,}/g, ' ').trim();

	let employees = await Employee.findAllAndPopulateImage();
	employees = filterEmployeesByKeyword(q)(employees);
	playSoundIfVolumeOn(req, "Search results");
	return res.render("employees", { employees, query : q });	
};

/* @Show */
exports.showEmployee = async (req, res, next) => {
	const { id } = req.params;
	let { page } = req.query;
	!page ? page = 0 : page-- ;
	/* find Employee */
	let employee = await Employee.findByIdAndPopulateImage(id);
	const { CIN } = employee;
	/* add attendances page */
	let attendances = await Attendance.filterPagination({CIN}, Number(page));
	if (!page) playSoundIfVolumeOn(req, `${employee.firstName}'s profile`);
	employee.attendances = attendances;
	let pages = await calculateFilteredAttendancesPagination({CIN}, page);
	/* send Response */
	res.render("show-employee", { employee, pages });
};

function calculateFilteredAttendancesPagination(criteria, page) {

	return Attendance.count(criteria).exec()
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
		if (!thereIsASelectedPage && pages.length>0)
			pages[0].selected=true;
			
		return pages;
	});
}

/* @Create AJAX */
exports.createEmployee = async (req, res, next) => {

	let { CIN, firstName, lastName, birthDate, phoneNumber } = req.body;
	// Sanitisation ...
	let employee = {};
	try { employee = await Employee.create({ CIN, firstName, lastName, birthDate, phoneNumber })
	} catch(e) {
		let message = getErrorMessageI18N(e);
		return next(new Error(message));
	}
	//winston.info('Saved in DB: '.green + employee._id);
	res.send({success: true, employee });
};

/* @GenerateReport */
exports.generateAttendancesReport = async (req, res, next) => {
	const { id } = req.params;
	let employee = await Employee.findByIdAndPopulateImage(id);
	let attendances = await Attendance.currentMonthAttendancesWithImages(employee.CIN)
	res.render("attendances-report", {employee, attendances});
};

/* @ProfileImage AJAX */
exports.setProfileImage = async (req, res, next) => {

	winston.info("setProfileImage");
	let imageFile = req.body.image;	
	let idEmployee = req.body.idEmployee;
	let image = await File.saveImageFile(imageFile)
		.then(updateProfileImage(idEmployee));
	res.send({ success: true, image });
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
exports.getCalendar = async (req, res, next) => {

	const idEmployee = req.params.id;
	let attendances = await currentMonthAttendances(idEmployee);
	let calendarData = formatAttendancesForCalendar(attendances);
	res.send({ success: true, calendarData });
};

async function currentMonthAttendances(idEmployee) {

	const CIN  = await getEmployeeCIN(idEmployee);
	let attendances = await Attendance.currentMonthAttendances(CIN);
	return attendances;
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