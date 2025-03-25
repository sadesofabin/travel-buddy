const express = require("express");
const router = express.Router();
const { approveContribution } = require("../controllers/adminController");

router.post("/approve/:contributionId", approveContribution);

module.exports = router;
