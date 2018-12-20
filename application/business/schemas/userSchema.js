const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    username: {type: String, index: true},
	password: String,
    isAdmin: {type: Boolean, default: false},
    email: { type: String, unique: true },
    CIN: { type: String, unique: true },
    role: {
        type: String, 
        enum: ['ROOT', 'ADMIN', 'SUPERVISOR', 'SIMPLE'],
        default: 'SIMPLE'
    }
});

module.exports = userSchema;