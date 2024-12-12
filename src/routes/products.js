const router = require("express").Router();
const productController = require("../controllers/productCreate.controller");

router.post("/create",productController.createProduct);

module.exports = router