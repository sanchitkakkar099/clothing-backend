const router = require("express").Router();
const adminroutes = require("./admin");
const staffroutes = require("./staff")
const categoryRoutes = require("./category");
const bloodTestRoutes = require("./bloodTest")
const customBloodTestRoutes = require("./customBloodTest")
const quoteRoutes = require("./quote");

router.use("/admin", adminroutes);
router.use("/staff",staffroutes);
router.use("/category", categoryRoutes);
router.use("/bloodtest", bloodTestRoutes);
router.use("/custombloodTest", customBloodTestRoutes);
router.use("/quote", quoteRoutes);
module.exports = router;