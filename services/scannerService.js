const Employee = require("../models/employee");
const Attendance = require("../models/attendance");

const winston = require("../config/winston");

const { addToLocalsPromise, playSoundIfVolumeOn } = require('../libs/utils')();
const { handleError } = require("../libs/errors");

/* @Index 
* - Charge les (3) dernièrs passages
* -- Pour chacun des passages, lui ajoute nom et prénom de l'employé
* - Charge le derniers passage avec l'image
* -- Lui ajoute l'employé avec son image de profil
*/
module.exports.indexQrScanner = (req, res, next) => {

    Attendance.findLastAttendances(3)
        .then(addEmployeeInfoToAttendancesPromiseAll)
        .then(addToLocalsPromise(res, 'lastAttendances'))  
        .then(Attendance.findLastAttendance)
        .then(addToLocalsPromise(res, 'lastAttendance'))
        .then(findAttendedEmployeeWithImage)
        .then(addToLocalsPromise(res, 'employee'))
        .then(() => playSoundIfVolumeOn(req,"Welcome ! The application has started"))
        .then(() => res.render("scanner"))
        .catch(handleError(next));
};
  
/* Used by 'attendanceService' */
module.exports.addEmployeeInfoToAttendancesPromiseAll = addEmployeeInfoToAttendancesPromiseAll;

/* Used here and @Exported */
function addEmployeeInfoToAttendancesPromiseAll(attendances) {
    /* For each attendance, add employees fname and lastname */
    let promises = getEachAttendedEmployeePromise(attendances);
    
    /* Quand j'ai trouvé les employees, assign them to their attendances */
    return Promise.all(promises).then(employeesNames => {
        return attendancesWithEmployee(attendances, employeesNames);
    });
}
  
/* @returns an Array of Promises */
function getEachAttendedEmployeePromise(attendances) {
    return attendances.map(att => {
        return Employee.findOne({ CIN: att.CIN }).select('firstName lastName').exec();
    });
}

function attendancesWithEmployee(lastAttendances, employeesNames) {
    return lastAttendances.map((attendance, i) => {
        attendance.employee = employeesNames[i];
        return attendance;
    });
}

function findAttendedEmployeeWithImage(lastAttendance) {
    if (!lastAttendance) return;
    return Employee.findAndPopulateImageByCIN(lastAttendance.CIN);
}
  
    