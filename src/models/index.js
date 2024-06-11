const mongoose = require("mongoose");
const models = require("../utils/modelName")
const { UserSchema } = require("./user")
const { InstallAppSchema } = require("./installApp")
const {VendorUsersSchema} = require("./VendorUsers");
const dbModels = {
    User: mongoose.model(models.User, UserSchema),   
    InstallApp:mongoose.model(models.InstallApp,InstallAppSchema),
    VendorUsers:mongoose.model(models.VendorUsers,VendorUsersSchema)  
}
module.exports = dbModels