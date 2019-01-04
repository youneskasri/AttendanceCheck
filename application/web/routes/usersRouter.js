const express = require('express'),
	router = express.Router(),
  catchErrors = require("express-catch-async");
const { isAdmin, isLoggedIn } = require("../controllers/authController");

const usersController = require("../controllers/userController");

router.use(isLoggedIn)
  .get('/', catchErrors(usersController.index))
  .get('/new', usersController.new)
  .post('/', catchErrors(usersController.create))
  .post('/:id/active', catchErrors(usersController.enableDisable))
  .get('/:id/edit', catchErrors(usersController.edit))
  .get('/:id',catchErrors(usersController.show))
  .patch('/:id', catchErrors(usersController.update))
  .delete('/:id',catchErrors(usersController.remove));
  
  
module.exports = router;
