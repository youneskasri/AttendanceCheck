const Employee = require("../models/employee");
const { filterEmployeesByKeyword, printEmployees } = Employee;

const { playSoundIfVolumeOn } = require('../libs/utils')();

/* @Index */
module.exports.allCards = (req, res, next) => {
	
	Employee.findAllAndPopulateImage()
	.then(employees =>{
		printEmployees(employees);
		playSoundIfVolumeOn(req, "Employees cards");
		return res.render("cards", { employees });
	}).catch(next);
}

/* @Search */
module.exports.searchCards = (req, res, next) => {
	/* Remplacer les espaces multiples par ' ', puis trim() */
	let q = req.query['q'].replace(/\s{2,}/g, ' ').trim();

	Employee.findAllAndPopulateImage()
	.then(filterEmployeesByKeyword(q))
	.then(employees => {
		playSoundIfVolumeOn(req, " Search results");
		return res.render("cards", { employees, query : q});	
	}).catch(next);
}

