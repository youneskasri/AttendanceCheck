const express = require('express'),
	router = express.Router();


const attendanceService = require("../services/attendanceService");

router.get('/:id', attendanceService.showAttendance)
	.post('/', attendanceService.createAttendance);

module.exports = router;
