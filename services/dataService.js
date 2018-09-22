const moment = require("moment");
const { handleError } = require("../libs/errors");
const Employee = require("../models/employee");
const exportFromJSON = require("export-from-json");

/* @Route /export/:format (csv, xsl, json ..) */
module.exports.exportDataToFormat = (req, res, next) => {
	
	let { format }= req.params; 
	if (!['csv', 'xls', 'json'].includes(format) ) return next("Invalid format");

	Employee.find().populate('attendances').exec()
	.then(extractDataRows)
	.then(data => convertToFileData(res, data, format))
	.catch(handleError(next));
}

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
		})	
	});
	return rows;
}

function convertToFileData(response, dataObj, exportType){
	// exportFromJSON actually supports passing JSON as the data option. It's very common that reading it from http request directly.
	const data = JSON.stringify(dataObj);
	const fileName = moment().format('YYYY-MM-DD HH mm ss')+'';
	const withBOM = exportType === 'xsl' ;
	const result = exportFromJSON({
		data,
		fileName,
		exportType,
		withBOM,
		processor (content, type, fileName) {
			switch (type) {
				case 'txt':
					response.setHeader('Content-Type', 'text/plain');
					break;
				case 'json':
					response.setHeader('Content-Type', 'text/plain');
					break;
				case 'csv':
					response.setHeader('Content-Type', 'text/csv');
					break;
				case 'xls':
					response.setHeader('Content-Type', 'application/vnd.ms-excel');
					break;
			}
			response.setHeader('Content-disposition', 'attachment;filename=' + fileName);
			return content;
		}
	})
	
	response.write(result);
	response.end();
}
