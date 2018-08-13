const express = require('express'),
	router = express.Router();

const employeeService = require("../services/employee-service");
const cardService = require("../services/card-service");

/* Before employees route to NOT confuse with /:id */
router.get('/cards', cardService.allCards)
	.get('/cards/search', cardService.searchCards);

router.get('/', employeeService.allEmployees)
	.get('/search', employeeService.searchEmployees)
	.get('/:id', employeeService.showEmployee)
	.post('/:id/profileImage', employeeService.setProfileImage)
	.post('/', employeeService.createEmployee);

module.exports = router;