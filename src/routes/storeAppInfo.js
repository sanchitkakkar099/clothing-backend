const router = require("express").Router();
const storeAppInfoController = require("../controllers/storeAppInfo.controller");

router.post("/",storeAppInfoController.createStoreAppInfo);

router.post("/list/by/storename",storeAppInfoController.storeInfoList);

module.exports = router