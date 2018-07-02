const mongoose = require("mongoose");

let attendanceSchema = mongoose.Schema({
	date: Date,
	image: { data: Buffer, contentType: String }
});

let Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;