const express = require('express'),
	router = express.Router();

const employeeService = require("../services/employeeService");

router.get('/', employeeService.allEmployees)
	.get('/search', employeeService.searchEmployees)
	.get('/:id/calendar', employeeService.getCalendar)
	.get('/:id', employeeService.showEmployee)
	.post('/:id/profileImage', employeeService.setProfileImage)
	.post('/', employeeService.createEmployee);

module.exports = router;