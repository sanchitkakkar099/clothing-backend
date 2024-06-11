const mongoose = require("mongoose")

 const VendorUsersSchema = new mongoose.Schema({
    shopname: { type: String },
    email : {type: String },
    password : {type:String},
    isact: { type: Boolean, default: true },
    isdel: { type: Boolean, default: false },
    isAppapproved: {type:Boolean, default: false},
    isAppinstall: { type: Boolean, default: true },
 }, { timestamps: true });

 exports.VendorUsersSchema = VendorUsersSchema