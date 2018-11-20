const express = require('express'),
    router = express.Router();
    const { isLoggedIn } = require("../services/authService");
const { catchErrors, catchErrorsAJAX } = require("../libs/errors");
const cardService = require("../services/cardService");

router.use(isLoggedIn)
    .get('/', catchErrors(cardService.allCards))
    .get('/search', catchErrors(cardService.searchCards));
    
module.exports = router;