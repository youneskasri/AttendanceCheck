const Employee = require("../models/employee");
const Attendance = require("../models/attendance");
const { playSoundIfVolumeOn } = require('../libs/utils')();

/* @Index 
* - Charge les (3) dernièrs passages
* -- Pour chacun des passages, lui ajoute nom et prénom de l'employé
* - Charge le derniers passage avec l'image
* -- Lui ajoute l'employé avec son image de profil
*/
module.exports.indexQrScanner = async (req, res, next) => {

    let lastAttendances = await Attendance.findLastAttendances(3);
    lastAttendances = await addEmployeeInfoToAttendancesPromiseAll(attendances);

    let lastAttendance = await Attendance.findLastAttendance();
    let employee = await findAttendedEmployeeWithImage(lastAttendance);
    
    playSoundIfVolumeOn(req,"Checking attendance");
    res.render("scanner", { lastAttendances, lastAttendance, employee });
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
  
    