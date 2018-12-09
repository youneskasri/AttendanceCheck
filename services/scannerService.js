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
    lastAttendances = await Employee.addEmployeeInfoToAttendancesPromiseAll(lastAttendances);

    let lastAttendance = await Attendance.findLastAttendance();
    let employee = await findAttendedEmployeeWithImage(lastAttendance);
    
    playSoundIfVolumeOn(req,"Checking attendance");
    res.render("scanner", { lastAttendances, lastAttendance, employee });
};

function findAttendedEmployeeWithImage(attendance) {
    if (!attendance) return;
    return Employee.findAndPopulateImageByCIN(attendance.CIN);
}
  
    