var express = require('express');
var router = express.Router();


/*
* Text To Speech 
*/
const SimpleTTS = require("simpletts");
const tts = new SimpleTTS();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
})
.post('/TTS', function(req, res, next){

	console.log(req.body);
	let text = req.body.content.replace("http://www.",'');
	textToSpeech(text, res);
});

function textToSpeech(text, res){
  tts.read({ text })
  .then(() => {
      console.log("Ok");
      res.end(text);
  }).catch((err) => {
      console.log(err);
  });
}


module.exports = router;