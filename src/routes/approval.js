const router = require("express").Router();
const AppApprovalControler = require("../controllers/appApproval.controller");

router.get("/request",AppApprovalControler.fetchapprovalrequest);
router.post("/change",AppApprovalControler.updateApproval);

module.exports = router