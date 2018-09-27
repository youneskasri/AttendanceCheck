const mongoose = require("mongoose");

let FileSchema = mongoose.Schema({
	creationDate: Date,
	contentType: String, // jpg, png etc...
	data: String
});

let File = mongoose.model("File", FileSchema);

File.saveImageFile = (imagePNG) => {
	return File.create({
		creationDate: new Date(),
		contentType: 'image/png',
		data: imagePNG
	});
};

module.exports = File;