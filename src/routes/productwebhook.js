const router = require("express").Router();
const productWebhookhandler = require("../controllers/productWebhook.controller");

router.get("/list",productWebhookhandler.handleProductUpdate);


module.exports = router