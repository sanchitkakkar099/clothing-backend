const mongoose = require("mongoose")

 const ProductSchema = new mongoose.Schema({
    vendorProductId: { type: String },
    shop_name: {type: String },
    parentProductId: { type: String },
    isDelVendorProduct: { type: Boolean, default: false },
    isDelParentProduct: { type: Boolean, default: false }
}, { timestamps: true });

exports.ProductSchema = ProductSchema   