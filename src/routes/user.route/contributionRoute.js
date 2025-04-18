const express = require("express");
const upload = require("../../middlewares/upload.middlewares");

const {
  addContribution,
  getContribution
} = require("@controllers/user.controller/contribution.controller");

const router = express.Router();

router.post("/add", upload.array("photos", 3),addContribution);
router.get("/get/:userId", getContribution);


module.exports = router;
