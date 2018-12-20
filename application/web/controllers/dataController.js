const moment = require("moment");
const Employee = require("../models/employee");
const exportFromJSON = require("export-from-json");

/*
* Exporte toute les attendances de chaque employee 
*/

/* @Route /export/:format (csv, xsl, json ..) */
exports.exportDataToFormat = async (req, res, next) => {
	
	let { format } = req.params; 
	if (!['csv', 'xls', 'json'].includes(format) ) return next("Invalid format");

	let data = await Employee.find().populate('attendances').exec()
		.then(extractDataRows);

	 setHeadersAndSendFile(res, data, format);
	 res.end();
};

function extractDataRows(employees) {
	let rows = [];
	employees.forEach(employee => {
		let { CIN, firstName, lastName } = employee;
		employee.attendances.forEach(attendance => {
			let row = { 
				CIN: CIN, 
				firstName: firstName, 
				lastName: lastName,
				date: moment(attendance.date).format('DD/MM/YYYY'),
				time: moment(attendance.date).format('HH:mm:ss')
			};
			rows.push(row);
		});	
	});
	return rows;
}

function setHeadersAndSendFile(res, dataObj, exportType){
	// exportFromJSON actually supports passing JSON as the data option. It's very common that reading it from http request directly.
	const data = JSON.stringify(dataObj);
	const fileName = moment().format('YYYY-MM-DD HH mm ss')+'';
	const withBOM = exportType === 'xsl' ;
	const result = exportFromJSON({
		data,
		fileName,
		exportType,
		withBOM,
		processor: setHeadersToExportFile(res)
	});
	res.write(result);
}

function setHeadersToExportFile (res) {
	return (content, type, fileName) => {
		switch (type) {
			case 'txt':
				res.setHeader('Content-Type', 'text/plain');
				break;
			case 'json':
				res.setHeader('Content-Type', 'text/plain');
				break;
			case 'csv':
				res.setHeader('Content-Type', 'text/csv');
				break;
			case 'xls':
				res.setHeader('Content-Type', 'application/vnd.ms-excel');
				break;
		}
		res.setHeader('Content-disposition', 'attachment;filename=' + fileName);
		return content;
	}
}