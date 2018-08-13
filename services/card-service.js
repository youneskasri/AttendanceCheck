const mongoose = require("mongoose");

const textToSpeech = require('../libs/utils')().textToSpeech;
const Employee = require("../models/employee");

/* @Index */
module.exports.allCards = (req, res, next) => {
	
	Employee.find({}).sort({ _id: -1 })
	.populate('profileImage')
	.exec((err, employees)=>{
		if (err) return next(err);
		res.locals.employees = employees;
		console.log("Found employees".green);
		console.log(employees.map(emp => {
			return { CIN: emp.CIN, firstName: emp.firstName, lastName: emp.lastName}
		}));
		if (req.session.volume === 'ON') textToSpeech("Employees cards");
		return res.render("cards");
	});
}

/* @Search */
module.exports.searchCards = (req, res, next) => {
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

		if (req.session.volume === 'ON') textToSpeech(" Search results");
		return res.render("cards");	
	});
}
