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
router.get('/', scanner)
.get('/employees', allEmployees)
.get('/employees/search', searchEmployees)
.post('/attendance', createAttendance);
//.post('/volume', setVolume)


function setVolume(req, res, next){

	console.log("volume ====> " +req.body.volume);
	req.session.volume = req.body.volume;
	return res.send({success: true, volume: req.session.volume});
}


function scanner(req, res, next) {
  textToSpeech("Welcome ! The application has started");
  return res.render('scanner');
}


	/* Fake data */ 
	let employees = require("../seeds/employees")(10);

function allEmployees(req, res, next){
	
	/* Fake data */ 
//	let employees = require("../seeds/employees")(10);
//	employees.forEach(emp => console.log(emp));

	res.locals.employees = employees;
	res.locals.myCondition = true;
	textToSpeech("List of employees");
	return res.render("employees");
}

function searchEmployees(req, res, next){

	/* Remplacer les espaces multiples par ' ', puis trim() */
	let q = req.query['q'].replace(/\s{2,}/g, ' ').trim();

	console.log('query = ' +q); 

	let filteredEmployees = employees
		.filter(emp => (emp.firstName + ' ' + emp.lastName + ' ' + emp.CIN)
						.toLowerCase().includes(q.toLowerCase()));

	res.locals.employees = filteredEmployees;

	textToSpeech("List of all employees");
	return res.render("employees");	
}

function createAttendance(req, res, next){
	let text = req.body.content.replace("http://www.",''),
		//imageWebP = req.body.image,
		faceImagePNG = req.body.faceImage,
		imageURL = 'public/images/myImage.png'; 

	fs.writeFile(imageURL, faceImagePNG,
	  	function playSoundAndSendResponse(){
			imageURL = imageURL.replace("public/",'');
			if (req.session.volume === true)  textToSpeech(text);
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