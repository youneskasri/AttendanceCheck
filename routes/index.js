const express = require('express'),
	router = express.Router(),
	fs = require("fs"),
	webp=require('webp-converter');

/*
* Text To Speech 
*/
const SimpleTTS = require("simpletts");
const tts = new SimpleTTS();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('scanner');
  textToSpeech("Welcome ! The application has started");
})
.post('/attendance', createAttendance);



function createAttendance(req, res, next){
	let text = req.body.content.replace("http://www.",''),
		//imageWebP = req.body.image,
		faceImagePNG = req.body.faceImage,
		imageURL = 'public/images/myImage.png'; 

	fs.writeFile(imageURL, faceImagePNG,
	  	function playSoundAndSendResponse(){
			imageURL = imageURL.replace("public/",'');
			textToSpeech(text);
			return res.send({ text, imageURL });
		});
}

function textToSpeech(text, res){
  tts.read({ text })
  .then(() => {
  	  if (!res) return;
      console.log("Ok");
      res.end(text);
  }).catch((err) => {
      console.log(err);
  });
}


module.exports = router;