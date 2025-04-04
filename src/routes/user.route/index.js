const express = require("express");

const userRoutes = require("./userRoute");
const commentRoutes = require("./commentRoute");
const followerRoute = require("./followerRoute");
const wishlistRoute = require("./wishlistRoute");


const router = express.Router();

router.use("/user", userRoutes);
router.use("/comment", commentRoutes);
router.use("/follower", followerRoute);
router.use("/wishlist", wishlistRoute);


module.exports = router;
