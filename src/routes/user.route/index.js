const express = require("express");

const userRoutes = require("./userRoute");
const commentRoutes = require("./commentRoute");

const router = express.Router();

router.use("/user", userRoutes);
router.use("/comment", commentRoutes);


module.exports = router;
