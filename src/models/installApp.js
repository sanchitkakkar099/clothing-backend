const mongoose = require("mongoose")

const InstallAppSchema = new mongoose.Schema({
    shop_name: { type: String },
    hmac: {type: String },
    timestamp: { type: String },
    isAppinstall: { type: Boolean, default: true },
}, { timestamps: true });

exports.InstallAppSchema = InstallAppSchema     