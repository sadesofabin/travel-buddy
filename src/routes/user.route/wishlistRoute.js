const express = require("express");
const {
  addToWishlist,
} = require("@controllers/user.controller/wishlist.controller");

const router = express.Router();

router.post("/add-wishlist", addToWishlist);

module.exports = router;
