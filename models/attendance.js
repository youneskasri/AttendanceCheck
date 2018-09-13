const mongoose = require("mongoose");
const moment = require("moment");

let attendanceSchema = mongoose.Schema({
	CIN: String,
	date: Date,
	faceImage: { type: mongoose.Schema.Types.ObjectId, ref: 'File'  }
});

let Attendance = mongoose.model("Attendance", attendanceSchema);


Attendance.findLastAttendances = (n) => {
	return Attendance.find({}).sort({date: -1}).limit(n).exec();
}

Attendance.findLastAttendance = () => {
	return Attendance.findOne().sort({date: -1}).populate('faceImage').exec();
}

Attendance.findByCIN = (CIN) => {
	return Attendance.find({CIN: CIN})
		.sort({_id: -1})
		.exec();
}

Attendance.findLastAttendancesByCIN = (n, CIN) => {
	return Attendance.find({ CIN }).sort({date: -1}).limit(n).exec();
}

Attendance.findByCinAndPopulateImage = (CIN) => {
	return Attendance.find({CIN: CIN})
		.sort({_id: -1})
		.populate('faceImage')
		.exec();
}

Attendance.currentMonthAttendances = (CIN) => {
	let date = new Date();
	let firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
	return Attendance.find({ CIN, date: {$gte: firstOfMonth} }).exec();
}

/* @Unused */
Attendance.currentMonthAttendancesWithImages = (CIN) => {
	let date = new Date();
	let firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
	return Attendance.find({ CIN, date: {$gte: firstOfMonth} }).populate('faceImage').exec();
}


/* @NotWorking
* Je pense abandonner cette fonctionnalité
*/
Attendance.findAttendanceEventByCinAndDate = (CIN, eventDate) => {
	let startDate = moment(eventDate).toDate();
	let endDate = moment(eventDate).add(8, 'hours').toDate();
	/* The Last One in this 1 hours Period */
	return Attendance.find({ CIN, date: {$gte: startDate, $lt: endDate} })
		.sort({ _id: -1 }).limit(1)
		.populate('faceImage').exec();
}

module.exports = Attendance;