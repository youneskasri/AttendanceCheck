let video = document.getElementById('faceVideo'),
  canvas = document.getElementById('todaysPictureCanvas'),
  context = canvas.getContext('2d'),
  vendorUrl = window.URL || window.webkitURL;

let width = 400; //$("todaysPictureCanvas").width();
let height = 300; //$("todaysPictureCanvas").height();

function turnOnTheWebCam(){
  navigator.mediaDevices.getUserMedia({
    video: true, 
    audio: false
  }).then(function(stream){
    video.srcObject = stream;
    video.play();
  }).catch(function(error){
    showErrorModal("#Error turnOnTheWebCam - FaceCamera : " + error);
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

