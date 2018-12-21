const express = require('express'),
	router = express.Router(),
    catchErrors = require("express-catch-async");
const { isLoggedIn } = require("../controllers/authController");

const attendanceController = require("../controllers/attendanceController");

router.use(isLoggedIn)
	.get('/search', catchErrors(attendanceController.searchAndFilterAttendances))
	.get('/:id', catchErrors(attendanceController.showAttendance))
	.get('/', catchErrors(attendanceController.allAttendances))
	.post('/', catchErrors(attendanceController.createAttendance));

module.exports = router;
