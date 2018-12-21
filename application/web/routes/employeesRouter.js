const express = require('express'),
	router = express.Router(),
    catchErrors = require("express-catch-async");
const { isLoggedIn } = require("../controllers/authController");
const employeeController = require("../controllers/employeeController");

router.use(isLoggedIn)
	.get('/', catchErrors(employeeController.allEmployees))
	.get('/search', catchErrors(employeeController.searchEmployees))
	.get('/:id/report', catchErrors(employeeController.generateAttendancesReport))
	.get('/:id/calendar', catchErrors(employeeController.getCalendar))
	.get('/:id', catchErrors(employeeController.showEmployee))
	.post('/:id/profileImage', catchErrors(employeeController.setProfileImage))
	.post('/', catchErrors(employeeController.createEmployee));

module.exports = router;