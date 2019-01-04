const User = require("../../business/models/user");
const winston = require("../../../libs/winston");
const moment = require("moment");
const getErrorMessageI18N = require("./errorMessagesI18N");

exports.index = async (req, res, next) => {
    let users = await User.findAllWithoutPassword();
    let usersWithoutCurrent = users.filter(user => user.username !== req.user.username);
    res.render("users", { users: usersWithoutCurrent });
};

exports.new = (req, res, next) => {
    res.render("newUser");
};

exports.create = async (req, res, next) => {
    let { username, password, repeatedPassword, role, CIN, email }= req.body;
    // Sanitizing
    // TODO

    if (password !== repeatedPassword) {
        req.flash('error', "REPEAT_PASSWORD_NOT_MATCH");      
        return res.redirect("back");  
    }
    await User.create({ username, password, role, CIN, email })
    .catch(e => {
        req.flash('error', getErrorMessageI18N(e));      
        return res.redirect("back");
    }); 
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

exports.enableDisable = async (req, res, next) => {
    const { id } = req.params;
    const { enable, disable } = req.body;

    if (enable) {
        await User.enableAccount({ _id : id });
    } else if (disable) {
        await User.disableAccount({ _id: id });
    } else {
        req.flash("error", "ERROR_WHILE_PROCESSING");
    }
    res.redirect("/users");
};

exports.remove = async (req, res, next) => {
    res.send("removed user");
};