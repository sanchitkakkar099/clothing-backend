const router = require("express").Router();
const storeAppInfoController = require("../controllers/storeAppInfo.controller");

router.post("/",storeAppInfoController.createStoreAppInfo);

router.post("/list/by/storename",storeAppInfoController.storeInfoList);

router.post("/product/count",storeAppInfoController.storeProductCount);

router.post("/vendor/orders",storeAppInfoController.storeOrders);

router.post("/store-profile",storeAppInfoController.StoreProfile);

module.exports = router