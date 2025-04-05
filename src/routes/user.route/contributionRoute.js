const express = require("express");
const {
  addContribution,
  getContribution
} = require("@controllers/user.controller/contribution.controller");

const router = express.Router();

router.post("/add", addContribution);
router.get("/get/:userId", getContribution);


module.exports = router;
