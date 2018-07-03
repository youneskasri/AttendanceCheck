const mongoose = require("mongoose");

let employeeSchema = mongoose.Schema({
	CIN: { type: String, unique: true },
	registrationDate: Date,
	firstName: String,
	lastName: String,
	birthDate: Date,
	phoneNumber: String,
	attendances: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attendance' }]
});

let Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;