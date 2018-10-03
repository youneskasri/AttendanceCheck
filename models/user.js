const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

let UserSchema = new mongoose.Schema({
    username: {type: String, index: true},
	password: String,
    isAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", UserSchema);

module.exports = User;