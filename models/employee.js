const mongoose = require("mongoose");

let employeeSchema = mongoose.Schema({
	CIN: { type: String, unique: true },
	registrationDate: Date,
	firstName: String,
	lastName: String,
	birthDate: Date,
	phoneNumber: String,
	profileImage: { type: mongoose.Schema.Types.ObjectId, ref: 'File'  },
	attendances: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attendance' }]
});

let Employee = mongoose.model("Employee", employeeSchema);

Employee.findAndPopulateImageByCIN = (CIN) => {
	return Employee.findOne({CIN: CIN}).populate('profileImage').exec();
}

module.exports = Employee;