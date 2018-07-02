const faker = require("faker");

function RandomEmployee(){
	this.CIN = faker.random.alphaNumeric() + faker.random.number(),
	this.firstName = faker.name.firstName(),
	this.lastName = faker.name.lastName(),
	this.birthDate = faker.date.past(),
	this.phoneNumber = faker.phone.phoneNumber(),
	this.lastWeekAttendances = randomLastWeekAttendances()
}	

function randomLastWeekAttendances(){
	let weekAttendances = [];
	for(let i = 0; i<7; i++){
		Math.random()>0.5 ? weekAttendances.push(true) : weekAttendances.push(false);
	}
	return weekAttendances;
}

module.exports = function getSomeRandomEmployees(number){
	let employees = [];
	for (let i = 0; i<number; i++)
		employees.push(new RandomEmployee());

	return employees;
}