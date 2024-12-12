const router = require("express").Router();
const ordersController = require("../controllers/orders.controller");
const {AdminAuth} = require("../middleware/auth")
router.get("/list",AdminAuth,ordersController.fetchOrdersController);


module.exports = router