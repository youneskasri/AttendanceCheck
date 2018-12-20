const winston = require("../../../libs/winston");
const mongoose = require("mongoose");

let employeeSchema = require("../schemas/employeeSchema");
let Employee = mongoose.model("Employee", employeeSchema);

Employee.findByCIN = (CIN) => {
	return Employee.findOne({CIN: CIN}).exec();
};

Employee.findAndPopulateImageByCIN = (CIN) => {
	return Employee.findOne({CIN: CIN}).populate('profileImage').exec();
};

Employee.findAllAndPopulateImage = () => { 
	return Employee.find({}).sort({ _id: -1 })
	.populate('profileImage')
	.exec();
};

Employee.findByIdAndPopulateImage = (id) => {
	let query = Employee.findById({ _id: id});
	query.populate('profileImage');
	return query.exec(); // promise
};


Employee.findByIdAndPopulateImageAndAttendances = (id) => {
	let query = Employee.findById({ _id: id});
	query.populate('profileImage');
	query.populate('attendances');
	return query.exec(); // promise
};

Employee.filterEmployeesByKeyword = function (q) {
	return employees => employees
		.filter(emp => (emp.firstName + ' ' + emp.lastName + ' ' + emp.CIN)
			.toLowerCase().includes(q.toLowerCase()));
};

Employee.printEmployees = function (employees) {
	winston.info("Found employees".green);
	winston.info(employees.map(emp => {
		return { CIN: emp.CIN, firstName: emp.firstName, 
			lastName: emp.lastName, birthDate: emp.birthDate };
	}));
};



  
/* Used by 'attendanceService' & 'scannerService' ... */
Employee.addEmployeeInfoToAttendancesPromiseAll = (attendances) => {
    /* For each attendance, add employees fname and lastname */
    let promises = getEachAttendedEmployeePromise(attendances);
    
    /* Quand j'ai trouvé les employees, assign them to their attendances */
    return Promise.all(promises).then(employeesNames => {
        return attendancesWithEmployee(attendances, employeesNames);
    });
}
  
/* @returns an Array of Promises */
function getEachAttendedEmployeePromise(attendances) {
    return attendances.map(att => {
        return Employee.findOne({ CIN: att.CIN }).select('firstName lastName').exec();
    });
}

function attendancesWithEmployee(attendances, employeesNames) {
    return attendances.map((attendance, i) => {
        attendance.employee = employeesNames[i];
        return attendance;
    });
}


module.exports = Employee;