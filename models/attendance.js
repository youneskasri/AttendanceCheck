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
	return Attendance.findOne().sort({date: -1}).populate('faceImage').exec()
}

module.exports = Attendance;