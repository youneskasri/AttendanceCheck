
  $(document).ready(()=>{

    $("button.showAttendance").click(evt => {
      evt.preventDefault();
      let target = $(evt.target);
      let url = target.find("span.url").text();
      $.get(url)
        .done(data => {
          if (data.success) {
            console.log(data.attendance.idEmployee, "idEmployee");
            console.log(data.attendance.CIN, "CIN employee");
            showAttendanceModal(data.attendance);
          } else  {
            alertError(data.error || "ERROR_WHILE_SHOWING_ATTENDANCE");
          }
        })
        .fail(showErrorModalJquery);
    });
  });


  function showAttendanceModal(attendance){
    const DATE_FORMAT = 'DD/MM/YYYY à HH:mm:s';
    let date = moment(attendance.date).format(DATE_FORMAT);
    $("#showEmployeeLink").attr("href", "/employees/"+attendance.idEmployee);
    $("#attendanceDate").text(date);
    $("#attendanceImage").attr("src",attendance.faceImage.data);
    $("#attendanceCIN").text(attendance.CIN);
    $("#attendanceFirstName").text(attendance.firstName);
    $("#attendanceLastName").text(attendance.lastName);
    $("#showAttendanceModal").modal("show");
  }

