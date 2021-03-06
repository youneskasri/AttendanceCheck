const Employee = require("../../business/models/employee");
const { filterEmployeesByKeyword, printEmployees } = Employee;
const { playSoundIfVolumeOn } = require('../../../libs/utils')();

/* @Index */
exports.allCards = async (req, res, next) => {
	
	let employees = await Employee.findAllAndPopulateImage()
	playSoundIfVolumeOn(req, "Employees cards");
	return res.render("cards", { employees });
};

/* @Search */
exports.searchCards = async (req, res, next) => {
	/* Remplacer les espaces multiples par ' ', puis trim() */
	let q = req.query.q.replace(/\s{2,}/g, ' ').trim();

	let employees = await Employee.findAllAndPopulateImage()
	employees = filterEmployeesByKeyword(q)(employees);

	playSoundIfVolumeOn(req, " Search results");
	return res.render("cards", { employees, query : q});	
};

