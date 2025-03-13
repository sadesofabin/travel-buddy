const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  
    required: true
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',  
    required: true
  },
  wishList: {
    type: Boolean,
    default: true 
  },
  visited: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Wishlist = mongoose.model('Wishlist', WishlistSchema);

module.exports = Wishlist;
