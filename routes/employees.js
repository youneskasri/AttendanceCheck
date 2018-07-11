const express = require('express'),
	router = express.Router(),
	fs = require("fs"),
	mongoose = require("mongoose");

const textToSpeech = require('../libs/utils')().textToSpeech;

const Employee = require("../models/employee");
const File = require("../models/file");
const Attendance = require("../models/attendance");

router.get('/', allEmployees)
	.get('/search', searchEmployees)
	.get('/cards', allCards)
	.get('/cards/search', searchCards)
	.get('/:id', showEmployee)
	.post('/:id/profileImage', setProfileImage)
	.post('/', createEmployee);


function searchCards(req, res, next){
	/* Remplacer les espaces multiples par ' ', puis trim() */
	let q = req.query['q'].replace(/\s{2,}/g, ' ').trim();

	Employee.find({}).sort({ _id: -1 })
	.populate('profileImage')
	.exec((err, employees)=>{
		if (err) return printError(err);
		let filteredEmployees = employees
			.filter(emp => (emp.firstName + ' ' + emp.lastName + ' ' + emp.CIN)
							.toLowerCase().includes(q.toLowerCase()));

		res.locals.employees = filteredEmployees;

		textToSpeech(" Search results");
		return res.render("cards");	
	});
}

function allCards(req, res, next){
	
	Employee.find({}).sort({ _id: -1 })
	.populate('profileImage')
	.exec((err, employees)=>{
		if (err) return console.log(err);
		res.locals.employees = employees;
		console.log("Found employees".green);
		console.log(employees.map(emp => {
			return { CIN: emp.CIN, firstName: emp.firstName, lastName: emp.lastName}
		}));
		if (req.session.volume === 'ON') textToSpeech("Employees cards");
		return res.render("cards");
	});
}

function searchEmployees(req, res, next){

	/* Remplacer les espaces multiples par ' ', puis trim() */
	let q = req.query['q'].replace(/\s{2,}/g, ' ').trim();



	Employee.find({}).sort({ _id: -1 })
	.populate('profileImage')
	.exec((err, employees)=>{
		if (err) return printError(err);
		let filteredEmployees = employees
			.filter(emp => (emp.firstName + ' ' + emp.lastName + ' ' + emp.CIN)
							.toLowerCase().includes(q.toLowerCase()));

		res.locals.employees = filteredEmployees;

		textToSpeech("Search results");
		return res.render("employees");	
	});
}


function printError(err){
	console.log(err.message.red);
	fs.write('./log/'+Date.now()+'.log', err);
	console.log(err);
}


function setProfileImage(req, res, next){

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
		.catch(printError);
	}).catch(printError);
}

function deleteOldImageIfExists(oldEmployee){
	if (oldEmployee.profileImage){
		File.findByIdAndRemove({_id: oldEmployee.profileImage})
		.exec().catch(printError);
	} else {
		console.log("No previous image file");
	}	
}

function findEmployeeById(id, populateImage, populateAttendances){
	let query = Employee.findById({ _id: id});
	if (populateImage) query = query.populate('profileImage');
	if (populateAttendances) query = query.populate('attendances');
	return query.exec(); // promise
}

function findEmployeeThenSendImage(res, id){
	findEmployeeById(id, true)
	.then(employee => {
		let image = employee.profileImage;
		return res.send({ success: true, image });
	}).catch(printError);
}

function showEmployee(req, res, next){
	findEmployeeById(req.params.id, true, true)
	.then(employee => {
		Attendance.find({CIN: employee.CIN})
		.sort({_id: -1})//.populate('faceImage')
		.exec()
		.then(attendances => {
			console.log(attendances[0].date);
			employee.attendances = attendances;
		})
		.catch(printError);
		
		res.locals.employee = employee;
		textToSpeech(employee.firstName + "'s profile");
		return res.render("show-employee");
	})
	.catch(printError);
}

function createEmployee(req, res, next){

	Employee.create({
		CIN: req.body.CIN,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		birthDate: new Date(req.body.birthDate),
		phoneNumber: req.body.phoneNumber
	})
	.then(savedEmployee => {
		console.log('Saved in DB: '.green + savedEmployee._id);
		res.send({success: true, employee: savedEmployee});
	})
	.catch(err => {
		console.log(err.message.red);
		if (err.code === 11000) return res.send({error: err});
		fs.write('log/'+Date.now()+'.log', err);
	}); 
}

function allEmployees(req, res, next){

	Employee.find({}).sort({ _id: -1})
	.populate('profileImage')
	.exec((err, employees)=>{
		if (err) return console.log(err);
		res.locals.employees = employees;
		console.log("Found employees".green);
		console.log(employees.map(emp => {
			return { CIN: emp.CIN, firstName: emp.firstName, lastName: emp.lastName}
		}));
		if (req.session.volume === 'ON') textToSpeech("List of employees");
		return res.render("employees");
	});
}


module.exports = router;