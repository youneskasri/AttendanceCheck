$(document).ready(findLastAttendance);

function findLastAttendance() {
    let $lastAttendance = $("li.attendance").first();
console.log($lastAttendance);
    let url = $lastAttendance.find("span.url").text();
console.log(url);
$.get(url)
        .done(data => {
            if (data.error) {
                handleError(data.error);
            } else 
                setLastAttendance(data.attendance)
        })
        .fail((jqXHR, textStatus, errorMessage) => {
            showErrorModal(errorMessage, textStatus, jqXHR);
        });
}

function setLastAttendance(attendance) {
    const DATE_FORMAT = 'DD/MM/YYYY à HH:mm';
    let date = moment(attendance.date).format(DATE_FORMAT);
    $("#lastAttendanceDate").text(date);
    $("#lastAttendanceImage").attr("src",attendance.faceImage.data);
}
