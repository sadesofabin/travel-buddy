const express = require("express");
const {
  addToWishlist, wishlisted

} = require("@controllers/user.controller/wishlist.controller");

const router = express.Router();

router.post("/add-wishlist", addToWishlist);
router.get("/:userId/wishlisted/:locationId", wishlisted);


module.exports = router;
