const Employee = require("../models/employee");
const File = require("../models/file");
const Attendance = require("../models/attendance");

const { filterEmployeesByKeyword, printEmployees } = Employee;
const { playSoundIfVolumeOn } = require('../libs/utils')();
const { handleAjaxError, handleError, printError } = require("../libs/errors");

/* @Index */
module.exports.allEmployees = (req, res, next) => {

	let startTime = new Date();
	Employee.findAllAndPopulateImage()
	.then(employees =>{		
		printEmployees(employees);
		playSoundIfVolumeOn(req, "List of employees");
		console.log("Treatment time : " + (new Date() - startTime));
		return res.render("employees", { employees });
	}).catch(handleError(next));
}


/* @Search */
module.exports.searchEmployees = (req, res, next) => {

	/* Remplacer les espaces multiples par ' ', puis trim() */
	let q = req.query['q'].replace(/\s{2,}/g, ' ').trim();

	Employee.findAllAndPopulateImage()
	.then(filterEmployeesByKeyword(q))
	.then(employees => {
		playSoundIfVolumeOn(req, "Search results");
		return res.render("employees", { employees, query : q });	
	}).catch(handleError(next));
}

/* @Show - A Refactorer */
module.exports.showEmployee = (req, res, next) => {
	Employee.findByIdAndPopulateImageAndAttendances(req.params.id)
	.then(employee => {
		/*
		* A Revoir, banli non nécessaire had findByCIN
		* Wa9ila bach t3alej chi truc to not load old images or something ???
		*/
		return Attendance.findByCIN(employee.CIN)
		.then(attendances => {
			console.log(attendances);
			employee.attendances = attendances;		
			playSoundIfVolumeOn(req, employee.firstName + "'s profile")
			return res.render("show-employee", { employee });
		}); // Async Kaboom Error is handled in the last catch block
	}).catch(handleError(next));
}

/* @Create AJAX */
module.exports.createEmployee = (req, res) => {

	validateInputsAndSaveEmployee(req.body)
	.then(savedEmployee => {
		console.log('Saved in DB: '.green + savedEmployee._id);
		res.send({success: true, employee: savedEmployee});
	})
	.catch(sendErrorAjax(res)); 
}

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

	console.log("setProfileImage");
	let imageFile = req.body.image;	
	let idEmployee = req.body.idEmployee;
	File.saveImageFile(imageFile)
		.then(updateProfileImage(idEmployee))
		.then(image => res.send({ success: true, image }))
		.catch(handleAjaxError(res));
}

function updateProfileImage(idEmployee) {
	return createdFile => {
		console.log(idEmployee);
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
		.exec()	/* Error is Handled well in the last CATCH Block (y) */
	} else {
		console.log("No previous image file");
	}	
}



