const router = require("express").Router();
const installAppController = require("../controllers/installAppData.controller");

router.get("/list",installAppController.installAppDataList);


module.exports = router