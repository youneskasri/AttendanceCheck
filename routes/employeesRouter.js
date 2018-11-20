const express = require('express'),
	router = express.Router();

const { catchErrors, catchErrorsAJAX } = require("../libs/errors");	
const employeeService = require("../services/employeeService");

router.get('/', catchErrors(employeeService.allEmployees))
	.get('/search', catchErrors(employeeService.searchEmployees))
	.get('/:id/report', catchErrors(employeeService.generateAttendancesReport))
	.get('/:id/calendar', employeeService.getCalendar)
	.get('/:id', catchErrors(employeeService.showEmployee))
	.post('/:id/profileImage', employeeService.setProfileImage)
	.post('/', catchErrorsAJAX(employeeService.createEmployee));

module.exports = router;