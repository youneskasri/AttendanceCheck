const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    username: {type: String, index: true},
	password: String,
    isAdmin: {type: Boolean, default: false},
    role: {
        type: String, 
        enum: ['ROOT', 'ADMIN', 'SUPERVISOR', 'SIMPLE'],
        default: 'SIMPLE'
    }
});

module.exports = userSchema;