const express = require('express'),
	router = express.Router();
const { isLoggedIn } = require("../services/authService");
const { catchErrors } = require("../libs/errors");

const attendanceService = require("../services/attendanceService");

router.use(isLoggedIn)
	.get('/search', catchErrors(attendanceService.searchAndFilterAttendances))
	.get('/:id', catchErrors(attendanceService.showAttendance))
	.get('/', catchErrors(attendanceService.allAttendances))
	.post('/', catchErrors(attendanceService.createAttendance));

module.exports = router;
