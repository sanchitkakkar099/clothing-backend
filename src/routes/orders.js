const router = require("express").Router();
const ordersController = require("../controllers/orders.controller");

router.get("/list",ordersController.fetchOrdersController);


module.exports = router