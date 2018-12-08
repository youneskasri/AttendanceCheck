const express = require('express'),
	router = express.Router();
const { isLoggedIn } = require("../services/authService");
const { catchErrors } = require("../libs/errors");	
const employeeService = require("../services/employeeService");

router.use(isLoggedIn)
	.get('/', catchErrors(employeeService.allEmployees))
	.get('/search', catchErrors(employeeService.searchEmployees))
	.get('/:id/report', catchErrors(employeeService.generateAttendancesReport))
	.get('/:id/calendar', catchErrors(employeeService.getCalendar))
	.get('/:id', catchErrors(employeeService.showEmployee))
	.post('/:id/profileImage', catchErrors(employeeService.setProfileImage))
	.post('/', catchErrors(employeeService.createEmployee));

module.exports = router;