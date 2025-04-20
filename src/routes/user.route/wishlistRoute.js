const express = require("express");
const {
  addToWishlist, wishlisted, getWishilistById

} = require("@controllers/user.controller/wishlist.controller");

const router = express.Router();

router.post("/add-wishlist", addToWishlist);
router.get("/:userId/wishlisted/:locationId", wishlisted);
router.get("/:userId/getLoc", getWishilistById );



module.exports = router;
