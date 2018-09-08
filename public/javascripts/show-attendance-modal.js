
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
        .fail((jqXHR, textStatus, errorMessage) => {
          showErrorModal(errorMessage, textStatus, jqXHR);
        });
    });
  });


  function showAttendanceModal(attendance){
    const DATE_FORMAT = 'DD/MM/YYYY à HH:mm:s';
    let date = moment(attendance.date).format(DATE_FORMAT);
    $("#attendanceDate").text(date);
    $("#attendanceImage").attr("src",attendance.faceImage.data);

    $("#showAttendanceModal").modal("show");
  }

