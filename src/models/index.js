const mongoose = require("mongoose");
const models = require("../utils/modelName")
const { UserSchema } = require("./user")
const { InstallAppSchema } = require("./installApp")
const {VendorUsersSchema} = require("./VendorUsers");
const {StoreAppInfoSchema} = require("./storeAppInfo");
const {ProductSchema} = require("./product");
const {StoreProfileSchema} = require("./storeProfile")
const dbModels = {
    User: mongoose.model(models.User, UserSchema),   
    InstallApp:mongoose.model(models.InstallApp,InstallAppSchema),
    VendorUsers:mongoose.model(models.VendorUsers,VendorUsersSchema),
    StoreAppInfo:mongoose.model(models.StoreAppInfo,StoreAppInfoSchema),
    Product: mongoose.model(models.Product, ProductSchema),
    StoreProfile: mongoose.model(models.StoreProfile,StoreProfileSchema)
}
module.exports = dbModels