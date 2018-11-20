const express = require('express'),
    router = express.Router();

const { catchErrors, catchErrorsAJAX } = require("../libs/errors");
const cardService = require("../services/cardService");

router.get('/', catchErrors(cardService.allCards))
    .get('/search', catchErrors(cardService.searchCards));
    
module.exports = router;