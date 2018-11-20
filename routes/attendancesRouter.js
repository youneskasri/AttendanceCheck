const express = require('express'),
	router = express.Router();

const { catchErrors, catchErrorsAJAX } = require("../libs/errors");

const attendanceService = require("../services/attendanceService");

router.get('/search', catchErrors(attendanceService.searchAndFilterAttendances))
	.get('/:id', catchErrorsAJAX(attendanceService.showAttendance))
	.get('/', catchErrors(attendanceService.allAttendances))
	.post('/', catchErrorsAJAX(attendanceService.createAttendance));

module.exports = router;
