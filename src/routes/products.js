const router = require("express").Router();
const productController = require("../controllers/productCreate.controller");
const productBytitlecontroller = require("../controllers/productByTitle.controller")

router.post("/create",productController.createProduct);
router.post("/bytitle",productBytitlecontroller.productsByTitle);

module.exports = router