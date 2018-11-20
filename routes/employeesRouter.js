const express = require('express'),
	router = express.Router();

const employeeService = require("../services/employeeService");

router.get('/', employeeService.allEmployees)
	.get('/search', employeeService.searchEmployees)
	.get('/:id/report', employeeService.generateAttendancesReport)
	.get('/:id/calendar', employeeService.getCalendar)
//	.get('/:id', employeeService.showEmployee)
	.get('/:id', catchErrors(employeeService.showEmployeeAsync))
	.post('/:id/profileImage', employeeService.setProfileImage)
	.post('/', employeeService.createEmployee);

module.exports = router;

function catchErrors(fn) {
	return function (req, res, next) {
		return fn(req, res, next).catch(next);
	};
}