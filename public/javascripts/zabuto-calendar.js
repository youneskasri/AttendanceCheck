let calendarData = [];

$(document).ready(()=> {
  let basePath = window.location.pathname;
  $.get(`${basePath}/calendar`)
    .done(result => { 
      calendarData = result.calendarData;
      setupZabutoCalendar();
    })
    .fail(showErrorModalJquery);
});

function setupZabutoCalendar() {
  /* Fetch Calendar Data*/
  $("#my-calendar").zabuto_calendar({
    language: "fr",
    data: calendarData,
    action: function() { loadAttendanceData(this.id); },  
    modal: true
  });
}

function loadAttendanceData(id) {
  let date = $("#" + id).data("date");
  let hasEvent = $("#" + id).data("hasEvent");

  if (hasEvent) {
    events = calendarData.filter(evt => evt.date == date);
    if (events.length > 0 ) {
      let lastEventId = events[events.length-1].body;
      getAttendanceByIdAndShowModal(lastEventId);
    } else {
      console.log("events.length == 0");
    }
  }      
}

function getAttendanceByIdAndShowModal(id) {
  $.get(`/attendances/${id}`)
    .done(data => {
      if (data.success) {
        showAttendanceModal(data.attendance);
      } else {
        console.log(data);
        alertError(data.error || "Can't Load Attendance Data");
      }
    }).fail(showErrorModalJquery);
}


