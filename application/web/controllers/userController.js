const User = require("../../business/models/user");
const winston = require("../../../libs/winston");
const moment = require("moment");


exports.index = async (req, res, next) => {
    let users = await User.findAllWithoutPassword();
    let usersWithoutCurrent = users.filter(user => user.username !== req.user.username);
    res.render("users", { users: usersWithoutCurrent });
};

exports.new = (req, res, next) => {
    res.render("newUser");
};

exports.create = async (req, res, next) => {
    let { username, password, role, CIN, firstName, lastName, phone, email }= req.body;
    // TODO Wrap Mongoose Exception with My I18N Custom Error Messages
    await User.create({ username, password, role, phone, email }); 
    res.redirect("/users");
};

/* @Show AJAX */
exports.show = async (req, res, next) => {
    const { username } = req.params;
    let user = await User.findOneWithoutPassword({ username });
    res.send(user);
};

exports.edit = async (req, res, next) => {
    const { username } = req.params;
    let user = await User.findOneWithoutPassword({ username });
    res.render("editUser", { user });
};

exports.update = async (req, res, next) => {
    res.send("updated user");
};

exports.remove = async (req, res, next) => {
    res.send("removed user");
}