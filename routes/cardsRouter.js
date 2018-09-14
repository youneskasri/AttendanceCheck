const express = require('express'),
    router = express.Router();
    
const cardService = require("../services/cardService");

router.get('/', cardService.allCards)
    .get('/search', cardService.searchCards);
    
module.exports = router;