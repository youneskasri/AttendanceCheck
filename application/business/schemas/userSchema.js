const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    username: {type: String, index: true},
	password: String,
    email: { type: String }, // Not Unique b/c Optional
    CIN: { type: String, unique: true },
    active: { type: Boolean, default: true},
    role: {
        type: String, 
        enum: ['ROOT', 'ADMIN', 'SUPERVISOR', 'USER'],
        default: 'USER'
    }
});

// TODO Tester
userSchema.methods.isAdmin = () => ['ROOT', 'ADMIN'].includes(this.role);

module.exports = userSchema;