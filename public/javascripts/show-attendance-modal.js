
  $(document).ready(()=>{
    $("button.showAttendance").click(evt => {
      evt.preventDefault();

      let url = $(evt.target).find("span.url").text();
      console.log(url);
      $.get(url)
        .done(data => {
          if (data.error) {
            handleError(data.error);
          } else 
            showAttendanceModal(data.attendance)
        })
        .fail(handleError);
    });
  });

  function handleError(err) {
    alert(err.message);
    console.log(err);
  } 

  function showAttendanceModal(attendance){
    $("#attendanceDate").val(attendance.date);
    $("#attendanceImage").attr("src",attendance.faceImage.data);

    $("#showAttendanceModal").modal("show");
  }

