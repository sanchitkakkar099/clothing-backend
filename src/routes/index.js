const router = require("express").Router();
const adminroutes = require("./admin");
const ordersroutes = require("./orders");
const installApproutes = require("./installAppData");
const productWebhook = require("./productwebhook");
const appApproval = require("./approval");
const storeAppInforoutes = require("./storeAppInfo")
const productsroutes = require("./products");
const dashboardDetailsroutes = require("./dashboard");
router.use("/admin", adminroutes);
router.use("/orders",ordersroutes);
router.use("/installapp",installApproutes);
router.use("/approval",appApproval);
router.use("/appapproval",appApproval);
router.use("/api/webhooks/product-update",productWebhook);
router.use("/storeappInfo",storeAppInforoutes);
router.use("/products",productsroutes);
router.use("/vendor",dashboardDetailsroutes);
module.exports = router;