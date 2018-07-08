const express = require('express'),
	router = express.Router(),
	fs = require("fs"),
	webp=require('webp-converter'),
	mongoose = require("mongoose");

const Employee = require("../models/employee");
const File = require("../models/file");

/*
* Text To Speech 
*/
const SimpleTTS = require("simpletts");
const tts = new SimpleTTS();

/* GET home page. */
router.use((req, res, next)=>{
	if (!req.session.volume) req.session.volume = 'ON';
	res.locals.volume = req.session.volume;
	next();
}).get('/', scanner)
.post('/volume', setVolume)
.post('/attendance', createAttendance)


.get('/employees/:id', showEmployee)
.post('/employees/:id/profileImage', setProfileImage)
.get('/employees', allEmployees)
.get('/employees/search', searchEmployees)
.post('/employees', createEmployee);


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

function findEmployeeById(id, populateImage){
	let query = Employee.findById({ _id: id});
	if (populateImage) query = query.populate('profileImage');
	return query.exec(); // promise
}

function findEmployeeThenSendImage(res, id){
	findEmployeeById(id, true)
	.then(employee => {
		let image = employee.profileImage;
		return res.send({ success: true, image });
	}).catch(printError);
}

function printError(err){
	console.log(err.message.red);
	fs.write('./log/'+Date.now()+'.log', err);
	console.log(err);
}


function showEmployee(req, res, next){
	Employee.find({_id: req.params.id})
	.populate('profileImage')
	.exec((err, employee)=>{
		if (err) return console.log(err);
		if (employee.profileImage)
			employee.hasImage = true;

		res.locals.employee = employee;
		console.log("Found ".green + employee.firstName);
		return res.render("show-employee");
	});
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

function searchEmployees(req, res, next){

	/* Remplacer les espaces multiples par ' ', puis trim() */
	let q = req.query['q'].replace(/\s{2,}/g, ' ').trim();

	console.log('query = ' +q); 

	Employee.find({}).sort({ _id: -1 })
	.exec((err, employees)=>{
		let filteredEmployees = employees
			.filter(emp => (emp.firstName + ' ' + emp.lastName + ' ' + emp.CIN)
							.toLowerCase().includes(q.toLowerCase()));

		res.locals.employees = filteredEmployees;

		textToSpeech("Search results");
		return res.render("employees");	
	});
}

function createAttendance(req, res, next){
	let text = req.body.content.replace("http://www.",''),
		//imageWebP = req.body.image,
		faceImagePNG = req.body.faceImage,
		imageURL = 'public/images/myImage.png'; 

	fs.writeFile(imageURL, faceImagePNG,
	  	function playSoundAndSendResponse(){
			imageURL = imageURL.replace("public/",'');
			if (req.session.volume === true)  textToSpeech(text);
			return res.send({ text, imageURL });
		});
}

function textToSpeech(text, res){
  tts.read({ text })
  .then(() => {
  	  if (!res) return;
      console.log("Ok");
      res.end(text);
  }).catch((err) => {
      console.log(err.message.yellow);
  });
}


module.exports = router;