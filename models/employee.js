const mongoose = require("mongoose");
const winston = require("../config/winston");

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

Employee.findAllAndPopulateImage = () => { 
	return Employee.find({}).sort({ _id: -1 })
	.populate('profileImage')
	.exec();
}

Employee.findByIdAndPopulateImage = (id) => {
	let query = Employee.findById({ _id: id});
	query.populate('profileImage');
	return query.exec(); // promise
}


Employee.findByIdAndPopulateImageAndAttendances = (id) => {
	let query = Employee.findById({ _id: id});
	query.populate('profileImage');
	query.populate('attendances');
	return query.exec(); // promise
}

Employee.filterEmployeesByKeyword = function (q) {
	return employees => employees
		.filter(emp => (emp.firstName + ' ' + emp.lastName + ' ' + emp.CIN)
			.toLowerCase().includes(q.toLowerCase()));
}

Employee.printEmployees = function (employees) {
	winston.info("Found employees".green);
	winston.info(employees.map(emp => {
		return { CIN: emp.CIN, firstName: emp.firstName, 
			lastName: emp.lastName, birthDate: emp.birthDate };
	}));
}

module.exports = Employee;