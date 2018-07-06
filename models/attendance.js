const mongoose = require("mongoose");

let attendanceSchema = mongoose.Schema({
	date: Date,
	image: { type: mongoose.Schema.Types.ObjectId, ref: 'File'  }
});

let Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;