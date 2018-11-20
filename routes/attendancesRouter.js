const express = require('express'),
	router = express.Router();
const { isLoggedIn } = require("../services/authService");
const { catchErrors, catchErrorsAJAX } = require("../libs/errors");

const attendanceService = require("../services/attendanceService");

router.use(isLoggedIn)
	.get('/search', catchErrors(attendanceService.searchAndFilterAttendances))
	.get('/:id', catchErrorsAJAX(attendanceService.showAttendance))
	.get('/', catchErrors(attendanceService.allAttendances))
	.post('/', catchErrorsAJAX(attendanceService.createAttendance));

module.exports = router;
