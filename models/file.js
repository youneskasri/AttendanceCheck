const mongoose = require("mongoose");

let FileSchema = mongoose.Schema({
	creationDate: Date,
	contentType: String, // jpg, png etc...
	data: String
});

let File = mongoose.model("File", FileSchema);

module.exports = File;