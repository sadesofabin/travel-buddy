const express = require("express");

const userRoutes = require("./userRoute");
const commentRoutes = require("./commentRoute");
const followerRoute = require("./followerRoute");

const router = express.Router();

router.use("/user", userRoutes);
router.use("/comment", commentRoutes);
router.use("/follower", followerRoute);

module.exports = router;
