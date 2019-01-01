const express = require('express'),
	router = express.Router(),
  catchErrors = require("express-catch-async");
const { isAdmin, isLoggedIn } = require("../controllers/authController");

const usersController = require("../controllers/userController");

router.use(isLoggedIn)
  .get('/', catchErrors(usersController.index))
  .get('/new', catchErrors(usersController.new))
	.post('/', catchErrors(usersController.create))
  .get('/:id/edit', catchErrors(usersController.edit))
  .get('/:id',catchErrors(usersController.show))
  .patch('/:id', catchErrors(usersController.update))
  .delete('/:id',catchErrors(usersController.remove));
  
  
module.exports = router;
