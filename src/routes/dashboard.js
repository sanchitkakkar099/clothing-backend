const router = require("express").Router();
const dashboardDetails = require("../controllers/dashboard.controller")
const {VendorAuth} = require("../middleware/auth")

router.post("/app/status",dashboardDetails.appStatus);

module.exports = router;