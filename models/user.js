const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

let UserSchema = new mongoose.Schema({
    username: {type: String, index: true},
	password: String,
    isAdmin: {type: Boolean, default: false},
    role: {
        type: String, 
        enum: ['ROOT', 'ADMIN', 'SUPERVISOR', 'SIMPLE'],
        default: 'SIMPLE'
    }
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", UserSchema);

module.exports = User;