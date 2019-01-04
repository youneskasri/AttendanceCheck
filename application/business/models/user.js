const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

let UserSchema = require("../schemas/userSchema");
UserSchema.plugin(passportLocalMongoose);
let User = mongoose.model("User", UserSchema);

User.findOneWithoutPassword = (criteria= {}) => {
    return User.findOne(criteria).select("-password").exec();
}

User.findAllWithoutPassword = (criteria = {}) => {
    return User.find(criteria).select("-password").exec();
}

User.enableAccount = (_id) => {
    return User.update({ _id }, { active: true });
};

User.disableAccount = (_id) => {
    return User.update({ _id}, { active: false });
};


module.exports = User;