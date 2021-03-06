const mongoose = require("mongoose");
const moment = require("moment");

let attendanceSchema = require("../schemas/attendanceSchema");
let Attendance = mongoose.model("Attendance", attendanceSchema);

Attendance.findAllSortByIdDesc = () => {
	return Attendance.find({}).sort({ _id: -1 }).exec();
};

Attendance.pagination = (page, limit) => {
	return makePaginationForAttendances({}, page, limit);
};

Attendance.filterPagination = (criteria, page, limit) => {
	return makePaginationForAttendances(criteria, page, limit);
};

function makePaginationForAttendances(criteria, page, limit) {
	let pageOptions = {
		page: page || 0,
		limit: limit || 10
	};

	return Attendance.find(criteria)
		.sort({ _id: -1 })
		.skip(pageOptions.page*pageOptions.limit)
		.limit(pageOptions.limit)
		.exec();
}

Attendance.findLastAttendances = (n) => {
	return Attendance.find({}).sort({date: -1}).limit(n).exec();
};

Attendance.findLastAttendance = () => {
	return Attendance.findOne().sort({date: -1}).populate('faceImage').exec();
};

Attendance.findByCIN = (CIN) => {
	return Attendance.find({CIN: CIN})
		.sort({_id: -1})
		.exec();
};

Attendance.findLastAttendancesByCIN = (n, CIN) => {
	return Attendance.find({ CIN }).sort({date: -1}).limit(n).exec();
};

Attendance.findByCinAndPopulateImage = (CIN) => {
	return Attendance.find({CIN: CIN})
		.sort({_id: -1})
		.populate('faceImage')
		.exec();
};

Attendance.currentMonthAttendances = (CIN) => {
	let firstOfMonth = getFirstOfThisMonth();
	return Attendance.find({ CIN, date: {$gte: firstOfMonth} }).sort({ _id: -1}).exec();
};

function getFirstOfThisMonth() {
	let date = new Date();
	let firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
	return firstOfMonth;
}


Attendance.currentMonthAttendancesWithImages = (CIN) => {
	let firstOfMonth = getFirstOfThisMonth();
	return Attendance.find({ CIN, date: {$gte: firstOfMonth} }).populate('faceImage').sort({ _id: -1}).exec();
};


/* A VERIFIER _ TODO
*/
Attendance.findAttendanceEventByCinAndDate = (CIN, eventDate) => {
	let startDate = moment(eventDate).toDate();
	let endDate = moment(eventDate).add(8, 'hours').toDate();
	/* The Last One in this 1 hours Period */
	return Attendance.find({ CIN, date: {$gte: startDate, $lt: endDate} })
		.sort({ _id: -1 }).limit(1)
		.populate('faceImage').exec();
};

module.exports = Attendance;

