const express = require('express'),
	router = express.Router();


const attendanceService = require("../services/attendanceService");

router.get('/search', attendanceService.searchAndFilterAttendances)
	.get('/:id', attendanceService.showAttendance)
	.get('/', attendanceService.allAttendances)
	.post('/', attendanceService.createAttendance);

/*
	Test With Async Await
*/
router.get('/search/await', attendanceService.searchAndFilterAttendancesAwait)
.get('/search/await2', catchErrors(attendanceService.searchAndFilterAttendancesAwait2));

function catchErrors(fn) {
	return function (req, res, next) {
		return fn(req, res, next).catch(next);
	}
};

module.exports = router;
