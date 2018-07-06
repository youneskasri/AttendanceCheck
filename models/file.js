const mongoose = require("mongoose");

let FileSchema = mongoose.Schema({
	creationDate: Date,
	type: String, // jpg, png etc...
	data: { data: Buffer, contentType: String }
});

let File = mongoose.model("File", FileSchema);

module.exports = File;