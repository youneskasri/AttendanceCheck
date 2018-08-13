const mongoose = require("mongoose");

const textToSpeech = require('../libs/utils')().textToSpeech;

const Employee = require("../models/employee");
const File = require("../models/file");
const Attendance = require("../models/attendance");


/* @Index */
module.exports.allEmployees = (req, res, next) => {

	let startTime = new Date();

	Employee.find({}).sort({ _id: -1})
	.populate('profileImage')
	.exec()
	.then(employees =>{
		res.locals.employees = employees;
		console.log("Found employees".green);
		console.log(employees.map(emp => {
			return { CIN: emp.CIN, firstName: emp.firstName, lastName: emp.lastName, birthDate: emp.birthDate}
		}));
		if (req.session.volume === 'ON') textToSpeech("List of employees");

		console.log("Treatment time : " + (new Date() - startTime));
		return res.render("employees");
	}).catch(next);
}

/* @Search */
module.exports.searchEmployees = (req, res, next) => {

	/* Remplacer les espaces multiples par ' ', puis trim() */
	let q = req.query['q'].replace(/\s{2,}/g, ' ').trim();

	Employee.find({}).sort({ _id: -1 })
	.populate('profileImage')
	.exec((err, employees)=>{
		if (err) return next(err);
		let filteredEmployees = employees
			.filter(emp => (emp.firstName + ' ' + emp.lastName + ' ' + emp.CIN)
							.toLowerCase().includes(q.toLowerCase()));

		res.locals.employees = filteredEmployees;

		res.locals.query = q;
		console.log("q-", q);

		if (req.session.volume === 'ON') textToSpeech("Search results");
		return res.render("employees");	
	});
}

/* @Show */
module.exports.showEmployee = (req, res, next) => {
	findEmployeeById(req.params.id, true, true)
	.then(employee => {
		Attendance.find({CIN: employee.CIN})
		.sort({_id: -1})//.populate('faceImage')
		.exec()
		.then(attendances => {
			console.log(attendances);
			employee.attendances = attendances;
		
			res.locals.employee = employee;
			if (req.session.volume === 'ON') textToSpeech(employee.firstName + "'s profile");
				return res.render("show-employee");
		})
		.catch(next);
	})
	.catch(next);
}

function findEmployeeById(id, populateImage, populateAttendances){
	let query = Employee.findById({ _id: id});
	if (populateImage) query = query.populate('profileImage');
	if (populateAttendances) query = query.populate('attendances');
	return query.exec(); // promise
}

/* @Create AJAX */
module.exports.createEmployee = (req, res, next) => {

	console.log(req.body.birthDate);

	Employee.create({
		CIN: req.body.CIN,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		birthDate: req.body.birthDate,
		phoneNumber: req.body.phoneNumber
	})
	.then(savedEmployee => {
		console.log('Saved in DB: '.green + savedEmployee._id);
		res.send({success: true, employee: savedEmployee});
	})
	.catch(err => { /* AJAX */
		printError(err);
		res.send({ error: err });
	}); 
}

/* @ProfileImage AJAX */
module.exports.setProfileImage = (req, res, next) => {

	console.log("setProfileImage");
	let file = req.body.image;	
	let idEmployee = req.body.idEmployee;
	File.create({
		creationDate: new Date(),
		contentType: 'image/png',
		data: file
	})
	.then(createdFile => {
		console.log(idEmployee);
		Employee.findByIdAndUpdate({ _id: idEmployee}, {profileImage: createdFile._id}, {new: false})
		.exec()
		.then(deleteOldImageIfExists)
		.then(()=>{ findEmployeeThenSendImage(res, idEmployee)})
		.catch(err => handleAjaxError(err, req, res));
	}).catch(err => handleAjaxError(err, req, res));
}

function deleteOldImageIfExists(oldEmployee){
	if (oldEmployee.profileImage){
		File.findByIdAndRemove({_id: oldEmployee.profileImage})
		.exec().catch(printError);
	} else {
		console.log("No previous image file");
	}	
}

function findEmployeeThenSendImage(res, id){
	findEmployeeById(id, true)
	.then(employee => {
		let image = employee.profileImage;
		return res.send({ success: true, image });
	}).catch(err => { /* AJAX */
		handleAjaxError(err, null, res);
	});
}

function handleAjaxError(err, req, res, next) {
	printError(err);
	console.log("Error message : " + err.message);
	res.send({ error: {stack: err.stack, message: err.message} });
}

function printError(err) { console.log("Error".green); console.log(err); }

