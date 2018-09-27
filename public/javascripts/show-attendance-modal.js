
  $(document).ready(()=>{

    $("button.showAttendance").click(evt => {
      evt.preventDefault();
      let target = $(evt.target);
      let url = target.find("span.url").text();
      $.get(url)
        .done(data => {
          if (data.error) {
            alertError(data.error);
          } else  {
            console.log(data.attendance.CIN, "ddd0");
            showAttendanceModal(data.attendance);
          }
            
        })
        .fail(showErrorModalJquery);
    });
  });


  function showAttendanceModal(attendance){
    const DATE_FORMAT = 'DD/MM/YYYY à HH:mm:s';
    let date = moment(attendance.date).format(DATE_FORMAT);
    $("#attendanceDate").text(date);
    $("#attendanceImage").attr("src",attendance.faceImage.data);
    $("#attendanceCIN").text(attendance.CIN);
    $("#attendanceFirstName").text(attendance.firstName);
    $("#attendanceLastName").text(attendance.lastName);
    $("#showAttendanceModal").modal("show");
  }

