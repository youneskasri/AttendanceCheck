const mongoose = require("mongoose");

let fileSchema = mongoose.Schema({
	creationDate: Date,
	contentType: String, // jpg, png etc...
	data: String
});

module.exports = fileSchema;