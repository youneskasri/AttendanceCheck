const express = require('express'),
  router = express.Router();

const usersController = require("../controllers/userController");

router.get('/users', usersController.index)
  .get('/users/new', usersController.new)
	.post('/users', usersController.create)
  .get('/users/:id/edit', usersController.edit)
  .get('/users/:id', usersController.show)
  .patch('/users/:id', usersController.update)
  .delete('/users/:id', usersController.remove);
  
  
module.exports = router;
