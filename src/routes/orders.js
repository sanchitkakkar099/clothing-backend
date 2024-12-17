const router = require("express").Router();
const ordersController = require("../controllers/orders.controller");
const {AdminAuth} = require("../middleware/auth")
router.get("/list",ordersController.fetchOrdersController);


module.exports = router