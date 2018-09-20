const express = require('express'),
	router = express.Router();


const attendanceService = require("../services/attendanceService");

router.get('/search', attendanceService.searchAndFilterAttendances)
	.get('/:id', attendanceService.showAttendance)
	.get('/', attendanceService.allAttendances)
	.post('/', attendanceService.createAttendance);

module.exports = router;
