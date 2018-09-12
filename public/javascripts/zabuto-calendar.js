let calendarData = [];
/* Enable Zabuto Calendar */
$(document).ready(()=> {
let basePath = window.location.pathname;
$.get(`${basePath}/calendar`)
  .done(result => { 
    calendarData = result.calendarData;
    setupZabutoCalendar();
  })
  .fail((jqXHR, textStatus, errorMessage) => {
    showErrorModal(errorMessage, textStatus, jqXHR);
  });

});

function setupZabutoCalendar() {
  console.log(calendarData);
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
  console.log(date);
  events = calendarData.filter(evt => evt.date == date);
  console.log(events);

  if (events.length > 0 ) {
    let lastEventId = events[events.length-1].body;
    getAttendanceByIdAndShowModal(lastEventId);
  } else {
    console.log("events.length == 0");
  }
}      
}

function getAttendanceByIdAndShowModal(id) {
let basePath = window.location.pathname;
$.get(`/attendances/${id}`)
  .done(data => {
    if (data.error) 
      handleError(data.error);
    else 
      showAttendanceModal(data.attendance);
  }).fail(showErrorModalJquery);
}


