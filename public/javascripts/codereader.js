const DATE_FORMAT = 'DD/MM/YYYY à HH:mm';

let scannerOptions = {
	video: document.getElementById('preview'),
	captureImage: false,
	backgroundScan: false,
  refractoryPeriod: 200
};

let scanner = new Instascan.Scanner(scannerOptions);

scanner.addListener('scan', handleScan);

function handleScan(content){

  let faceImage = takePicture(); /* fct from facecamera.js */
  if (TEST) alert("will send : "+content);
  $.post("/attendances", {content, faceImage})
  .done(result => {
      console.log("Result", result);
      if( result.success ){
        result.attendance.date = moment(result.attendance.date).format(DATE_FORMAT);
        updateTodaysPicture(result.todaysImage);
        setLastPersonChecked(result.attendance, result.employee);
        appendAttendanceToTable(result.attendance, result.employee);
      } else {
        alertError(result.error || "Error while trying to register attendance, Verify logs");
      }
  }).fail(showErrorModalJquery);
} 



function updateTodaysPicture(imageURL){
  $("#todaysPicture").attr("src", imageURL);
}

function setLastPersonChecked(attendance, employee){

  $("#lastPersonChecked").removeClass("d-none");

  if (employee.profileImage)
    $("#oldPicture").attr("src", employee.profileImage.data);
  
  $("#CIN").text(employee.CIN);
  $("#fullName").text(employee.firstName + ' ' + employee.lastName);
  $("#hrefLastPerson").attr("href", "/employees/" + employee._id);

  $("#birthDate").text(employee.birthDate);
  $("#attendanceDate").text(attendance.date);
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
    if (cameras.length > 1) 
      scanner.start(cameras[1]);
    else if (cameras.length > 0) 
      scanner.start(cameras[0]);
    else {
      alertError('No Camera Found');
    }
  })
  .catch(err => showErrorModal(err.message));

