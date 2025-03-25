const express = require("express");
const { addToWishlist } = require("../controllers/wishList");

const router = express.Router();

router.post("/add", addToWishlist);

module.exports = router;
