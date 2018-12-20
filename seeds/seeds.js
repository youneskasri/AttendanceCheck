const faker = require("faker"),
	mongoose = require("mongoose"),
	Employee = require("../application/business/models/employee"),
	Attendance = require("../application/business/models/attendance"),
	File = require("../application/business/models/file");


function RandomEmployee(){
	this.CIN = faker.random.alphaNumeric() + faker.random.number(),
	this.firstName = faker.name.firstName(),
	this.lastName = faker.name.lastName(),
	this.birthDate = faker.date.past(),
	this.phoneNumber = faker.phone.phoneNumber();
	//@TODO this.lastWeekAttendances = randomLastWeekAttendances()
}	

//@Unused
function randomLastWeekAttendances(){
	let weekAttendances = [];
	for(let i = 0; i<7; i++){
		Math.random()>0.5 ? weekAttendances.push(true) : weekAttendances.push(false);
	}
	return weekAttendances;
}

function getSomeRandomEmployees(number){
	let employees = [];
	for (let i = 0; i<number; i++)
		employees.push(new RandomEmployee());

	return employees;
}

module.exports = obj = {
	insertRandomEmployees: (number)=>{
		/* Remove All attendances */
		Attendance.remove({}).exec()
		.then(() => console.log("Removed all attendances"))
		.catch(console.log);

		File.remove({}).exec()
		.then(() => console.log("Removed all Files"))
		.catch(console.log);

		/* Remove All Employees */
	    Employee.remove({}, function(err){
	        if(err) return console.log(err);
        	console.log("Removed employees!");
	         //add sa few employees
	        getSomeRandomEmployees(number)
	        	.forEach(function(seed){
		            Employee.create(seed, function(err, campground){
		                if(err) return console.log(err);
		                console.log("Added an employee");
		            });
	         	});
	        let younesKasri = {
	        	CIN: "AD213583",
	        	firstName: "Younes",
	        	lastName: "Kasri",
	        	birthDate: "1996-10-25",
	        	phoneNumber: "+212 661264450"
	        };
            Employee.create(younesKasri, function(err, campground){
                if(err) return console.log(err);
                console.log("Added an employee");
            });
		    return obj;
	    })
	}
}