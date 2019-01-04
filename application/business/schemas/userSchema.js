const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    username: {type: String, index: true},
	password: String,
    isAdmin: {type: Boolean, default: false},
    email: { type: String, unique: true },
    CIN: { type: String, unique: true },
    active: { type: Boolean, default: true},
    role: {
        type: String, 
        enum: ['ROOT', 'ADMIN', 'SUPERVISOR', 'USER'],
        default: 'USER'
    }
});

module.exports = userSchema;