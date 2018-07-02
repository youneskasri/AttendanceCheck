const mongoose = require("mongoose");

let employeeSchema = mongoose.Schema({
	CIN: String,
	firstName: String,
	lastName: String,
	birthDate: Date,
	phoneNumber: String,
	attendances: [{ type: Schema.Types.ObjectId, ref: 'Attendance' }]
});

let Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;