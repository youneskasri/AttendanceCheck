const mongoose = require("mongoose");

let attendanceSchema = mongoose.Schema({
	CIN: String,
	date: Date,
	faceImage: { type: mongoose.Schema.Types.ObjectId, ref: 'File'  }
});

module.exports = attendanceSchema;