const mongoose = require("mongoose");

const StoreAppInfoSchema = new mongoose.Schema(
  {
    storeDomain: { type: String, required: true },
    apiKey: { type: String, required: true },
    apiSecreatKey: { type: String, required: true },
    accessToken: { type: String, required: true },
    isAppinstall: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

exports.StoreAppInfoSchema = StoreAppInfoSchema;
