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

  let faceImage = takePicture();
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





let video = document.getElementById('faceVideo'),
  canvas = document.getElementById('todaysPictureCanvas'),
  context = canvas.getContext('2d'),
  vendorUrl = window.URL || window.webkitURL;

let width = 400; //$("todaysPictureCanvas").width();
let height = 300; //$("todaysPictureCanvas").height();

/* Demander l'accès à la CAM */
navigator.getMedia = navigator.getUserMedia|| navigator.webkitGetUserMedia
  || navigator.mozGetUserMedia
  || navigator.mozGetUserMedia;

navigator.getMedia({
  video: true, 
  audio: false
}, function(stream){
  video.src = vendorUrl.createObjectURL(stream);
  video.play();
}, function(error){
  console.log("#Error getMedia 67 : " + error);
});

function takePicture(){
  context.drawImage(video, 0, 0, width, height);
  return canvas.toDataURL('image/png');
}



$("#testPicture").click(function(){
  handleScan("TEST");
});





