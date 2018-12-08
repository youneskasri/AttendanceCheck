const express = require('express'),
  router = express.Router();

router.get('/users', usersService.index)
  .get('/users/new', usersService.new)
	.post('/users', usersService.create)
  .get('/users/:id/edit', usersService.edit)
  .get('/users/:id', usersService.show)
  .patch('/users/:id', usersService.update)
  .delete('/users/:id', usersService.remove);
  
  
module.exports = router;
