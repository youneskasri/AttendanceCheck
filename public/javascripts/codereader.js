let scannerOptions = {
	video: document.getElementById('preview'),
	captureImage: false,
	backgroundScan: false
};

let scanner = new Instascan.Scanner(scannerOptions);

scanner.addListener('scan', handleScan);

function handleScan(content){

  let faceImage = takePicture(); /* fct from facecamera.js */
  if (TEST) alert("will send : "+content);
  $.post("/attendance", {content, faceImage}, function(result, status){
      //if (TEST) alert("Data: " + data.text + "\nStatus: " + status);
      updateTodaysPicture(result.todaysImage);
      setLastPersonChecked(result.employee);
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

function setLastPersonChecked(employee){
  $("#oldPicture").attr("src", employee.profileImage.data);
  $("#CIN").text(employee.CIN);
  $("#fullName").text(employee.firstName + ' ' + employee.lastName);
  $("#birthDate").text(employee.birthDate);
  $("#attendanceDate").text(new Date());
}




