const User = require("../models/user");

module.exports.index = async (req, res, next) => {
    res.render("users");
};

module.exports.new = (req, res, next) => {
    res.render("new user form");
};

module.exports.create = async (req, res, next) => {
    res.send("created user");
};

module.exports.show = async (req, res, next) => {
    res.send("show user");
};

module.exports.edit = async (req, res, next) => {
    res.send("edit user form")
};

module.exports.update = async (req, res, next) => {
    res.send("updated user");
};

module.exports.remove = async (req, res, next) => {
    res.send("removed user");
}