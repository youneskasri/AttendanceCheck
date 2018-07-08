let video = document.getElementById('faceVideo'),
  canvas = document.getElementById('todaysPictureCanvas'),
  context = canvas.getContext('2d'),
  vendorUrl = window.URL || window.webkitURL;

let width = 400; //$("todaysPictureCanvas").width();
let height = 300; //$("todaysPictureCanvas").height();

function turnOnTheWebCam(){
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
}

turnOnTheWebCam();

function takePicture(){
  context.drawImage(video, 0, 0, width, height);
  return canvas.toDataURL('image/png');
}



$("#testPicture").click(function(){
  handleScan("TEST");
});

