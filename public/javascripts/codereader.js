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
        appendAttendanceToTable(result.attendance, result.employee);
      }
  }).fail(result => {
    console.log(result);
    alert("jQuery Error");
  });
} 



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

function appendAttendanceToTable( attendance, employee){
  
  let $lastRow = $("tr.attendanceRow:nth-child(3)");
  $lastRow.remove();

  let $newRow = $(".attendanceRow:first-child").clone();
    $newRow.find("a.CIN").text(employee.CIN)
      .attr("href", "/employees/"+employee._id);
    $newRow.find("a.fullName").text(employee.firstName+' '+employee.lastName)
      .attr("href", "/employees/"+employee._id);
    $newRow.find("a.date").text(attendance.date)
      .attr("href", "/employees/"+employee._id);

  $("table tbody").prepend($newRow);
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



