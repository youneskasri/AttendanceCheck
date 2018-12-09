const User = require("../models/user");

exports.index = async (req, res, next) => {
    res.render("users");
};

exports.new = (req, res, next) => {
    res.render("new user form");
};

exports.create = async (req, res, next) => {
    res.send("created user");
};

exports.show = async (req, res, next) => {
    res.send("show user");
};

exports.edit = async (req, res, next) => {
    res.send("edit user form")
};

exports.update = async (req, res, next) => {
    res.send("updated user");
};

exports.remove = async (req, res, next) => {
    res.send("removed user");
}