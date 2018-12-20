const express = require('express'),
    router = express.Router();
const { isLoggedIn } = require("../controllers/authController");
const { catchErrors } = require("../../../libs/errors");
const cardController = require("../controllers/cardController");

router.use(isLoggedIn)
    .get('/', catchErrors(cardController.allCards))
    .get('/search', catchErrors(cardController.searchCards));
    
module.exports = router;