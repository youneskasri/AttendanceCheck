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
  $.post("/attendance", {content, faceImage})
  .done(result => {
      //if (TEST) alert("Data: " + data.text + "\nStatus: " + status);
      console.log("Result", result);
      if (result.error){
        console.log(result.error.stack);
        alert(result.error.message);
      } else {
        updateTodaysPicture(result.todaysImage);
        setLastPersonChecked(result.employee);
      }
  }).fail(result => {
    console.log(err);
    alert("jQuery Error");
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

  //$("#lastPersonChecked").show();

  if (employee.profileImage)
    $("#oldPicture").attr("src", employee.profileImage.data);
  
  $("#CIN").text(employee.CIN);
  $("#fullName").text(employee.firstName + ' ' + employee.lastName)
    .attr("href", "/employees/" + employee._id);

  $("#birthDate").text(employee.birthDate);
  $("#attendanceDate").text(new Date());
}

//$("#lastPersonChecked").hide(); // NO NEED FOR THAT B/C i'll load him from DB 




