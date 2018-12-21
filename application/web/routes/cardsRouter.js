const express = require('express'),
    router = express.Router(),
    catchErrors = require("express-catch-async");
const { isLoggedIn } = require("../controllers/authController");
const cardController = require("../controllers/cardController");

router.use(isLoggedIn)
    .get('/', catchErrors(cardController.allCards))
    .get('/search', catchErrors(cardController.searchCards));
    
module.exports = router;