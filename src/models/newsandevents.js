const mongoose = require('mongoose');

const NewsAndEventSchema = new mongoose.Schema({
  eventTime: {
    type: String, // or Date if you want to store full date-time
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  photo: {
    type: String, // URL or image filename
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  shortDescription: {
    type: String,
    required: true,
    trim: true,
  },
  longDescription: {
    type: String,
    required: true,
  },
  redirectionLink: {
    type: String, // URL to external page or article
  },
  primary: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const NewsAndEvent = mongoose.model('NewsAndEvent', NewsAndEventSchema);

module.exports = NewsAndEvent;
