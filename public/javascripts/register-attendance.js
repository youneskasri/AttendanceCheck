const DATE_FORMAT = 'DD/MM/YYYY à HH:mm';

// NOT WORKING ???? $("button#registerManually").on('click', registerAttendanceManually);


function registerAttendanceManually() {

  let CIN = $("input[name='CIN']").val();
  handleScan(CIN.toUpperCase());
  $("input[name='CIN']").val('');
}


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
        alertError(result.error || "ERROR_REGISTER_ATTENDANCE");
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
