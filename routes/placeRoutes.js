const express = require("express");
const router = express.Router();
const { createContribution, getContributions, getContributionById, updateContribution, deleteContribution,getContributionswithPagenation } = require("../controllers/placeController");

router.post("/createContribution", createContribution);
router.get("/getContributions", getContributions);
router.get("/getContributionById/:id", getContributionById);
router.put("/updateContribution/:id", updateContribution);
router.delete("/deleteContribution/:id", deleteContribution);


module.exports = router;
