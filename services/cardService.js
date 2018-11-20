const Employee = require("../models/employee");
const { filterEmployeesByKeyword, printEmployees } = Employee;

const { handleError } = require("../libs/errors");
const { playSoundIfVolumeOn } = require('../libs/utils')();

/* @Index */
module.exports.allCards = async (req, res, next) => {
	
	let employees = await Employee.findAllAndPopulateImage()
	playSoundIfVolumeOn(req, "Employees cards");
	return res.render("cards", { employees });
};

/* @Search */
module.exports.searchCards = async (req, res, next) => {
	/* Remplacer les espaces multiples par ' ', puis trim() */
	let q = req.query.q.replace(/\s{2,}/g, ' ').trim();

	let employees = await Employee.findAllAndPopulateImage()
	employees = filterEmployeesByKeyword(q)(employees);

	playSoundIfVolumeOn(req, " Search results");
	return res.render("cards", { employees, query : q});	
};

