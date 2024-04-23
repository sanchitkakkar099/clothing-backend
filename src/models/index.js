const mongoose = require("mongoose");

const models = require("../utils/modelName")
const { UserSchema } = require("./user")

const dbModels = {
    User: mongoose.model(models.User, UserSchema),
}


module.exports = dbModels