const mongoose = require("mongoose");

let FileSchema = require("../schemas/fileSchema");
let File = mongoose.model("File", FileSchema);

File.saveImageFile = (imagePNG) => {
	return File.create({
		creationDate: new Date(),
		contentType: 'image/png',
		data: imagePNG
	});
};

module.exports = File;