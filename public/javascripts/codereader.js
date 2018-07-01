/* Front */
const test = true;

let scannerOptions = {
	video: document.getElementById('preview'),
	captureImage: false,
	backgroundScan: false
};

let scanner = new Instascan.Scanner(scannerOptions);

scanner.addListener('scan', handleScan);

function handleScan(content){

  let faceImage = takePicture(); /* fct from facecamera.js */
  if (test) alert("will send : "+content);
  $.post("/attendance", {content, faceImage}, function(data, status){
      if (test) alert("Data: " + data.text + "\nStatus: " + status);
      updateTodaysPicture(faceImage);
  });
} 


Instascan.Camera.getCameras()
  .then(function (cameras) {
    /* Liste des caméras */
    cameras.map( (cam) => {
      let camName = cam && cam.name ? cam.name : 'Activate the Web Cam in your Browser then <a href=""> Refresh the page </a>';
      document.getElementById("cameras").innerHTML += '<li>'+ camName +'</li>';
    });
    /* Utiliser une camera */
    if (cameras.length > 0) 
      scanner.start(cameras[0]);
    else 
      console.error('No cameras found.');
  })
  .catch( (e) => console.error(e) );


function updateTodaysPicture(imageURL){
  $("#todaysPicture").attr("src", imageURL);
}





