const mongoose = require("mongoose");

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

Attendance.findByCinAndPopulateImage = (CIN) => {
	return Attendance.find({CIN: CIN})
		.sort({_id: -1})
		.populate('faceImage')
		.exec();
}

Attendance.currentMonthAttendancesWithImages = (CIN) => {
	let date = new Date();
	let firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
	return Attendance.find({ CIN, date: {$gte: firstOfMonth} }).populate('faceImage').exec();
}

module.exports = Attendance;