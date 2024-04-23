const router = require("express").Router();
const adminroutes = require("./admin");

router.use("/admin", adminroutes);
module.exports = router;