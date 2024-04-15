const mongoose = require("mongoose");

const models = require("../utils/modelName")
const { UserSchema } = require("./user")
const { CategorySchema } = require("./category");
const { BloodTestSchema } = require("./bloodTest");
const { CustomBloodTestSchema } = require("./customBloodTest")
const { QuoteSchema } = require("./quote");
const { OrderSchema } = require("./order");
const { OrderCountSchema } = require("./orderCount");

const dbModels = {
    User: mongoose.model(models.User, UserSchema),
    Category: mongoose.model(models.Category, CategorySchema),
    BloodTest: mongoose.model(models.BloodTest,BloodTestSchema),
    CustomBloodTest: mongoose.model(models.CustomBloodTest,CustomBloodTestSchema),
    Quote: mongoose.model(models.Quote,QuoteSchema),
    Order: mongoose.model(models.Order,OrderSchema),
    OrderCount: mongoose.model(models.OrderCount,OrderCountSchema)
}


module.exports = dbModels