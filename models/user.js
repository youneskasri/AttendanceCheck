const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

let UserSchema = require("./schemas/userSchema");
UserSchema.plugin(passportLocalMongoose);
let User = mongoose.model("User", UserSchema);

module.exports = User;