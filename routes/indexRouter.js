const express = require('express'),
	router = express.Router();
 
const winston = require("../config/winston");

const { playSoundIfVolumeOn } = require('../libs/utils')();

const scannerService = require("../services/scannerService");

/* GET home page. */
router.use(setVolumeOnByDefault)
.post('/volume', setVolume)
.get('/', scannerService.indexQrScanner);


function setVolumeOnByDefault(req, res, next) {
	if (!req.session.volume) req.session.volume = 'ON';
	res.locals.volume = req.session.volume;
	next();
}

/**
 * TODO Handling AJAX Error 
 */
/* @SetVolume AJAX */
function setVolume(req, res){

	req.session.volume = req.body.volume;
	winston.info("volume = " + req.session.volume);
	playSoundIfVolumeOn(req, "VOLUME ON");
	return res.send({success: true, volume: req.session.volume});
}

module.exports = router;