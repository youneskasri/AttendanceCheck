$(document).ready(findLastAttendance);

function findLastAttendance() {
    let $lastAttendance = $("tr.attendance").first();
    let url = $lastAttendance.find("span.url").text();
    if (!url) return console.log('No attendance for this employee');
    $.get(url)
    .done(data => {
        if (data.error)  // TODO
            alertError(data.error);
        else if (data.success && data.attendance) {
            setLastAttendance(data.attendance)
        } else {
            alertError("ERROR_FIND_LAST_ATTENDANCE");
        }
           
    })
    .fail(showErrorModalJquery);
}

function setLastAttendance(attendance) {
    const DATE_FORMAT = 'DD/MM/YYYY à HH:mm';
    let date = moment(attendance.date).format(DATE_FORMAT);
    $("#lastAttendanceDate").text(date);
    $("#lastAttendanceImage").attr("src",attendance.faceImage.data);
}
