$(document).ready(findLastAttendance);

function findLastAttendance() {
    let $lastAttendance = $("tr.attendance").first();
    let url = $lastAttendance.find("span.url").text();

    $.get(url)
    .done(data => {
        if (data.error) 
            alertError(data.error);
        else 
            setLastAttendance(data.attendance)
    })
    .fail(showErrorModalJquery);
}

function setLastAttendance(attendance) {
    const DATE_FORMAT = 'DD/MM/YYYY à HH:mm';
    let date = moment(attendance.date).format(DATE_FORMAT);
    $("#lastAttendanceDate").text(date);
    $("#lastAttendanceImage").attr("src",attendance.faceImage.data);
}
