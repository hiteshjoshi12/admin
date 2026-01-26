const mongoose = require('mongoose');

const runwayVideoSchema = mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true }, // The .mp4 link
  ctaText: { type: String, default: "Shop The Look" }, // Replaces 'price' in your UI
  link: { type: String, default: "/shop" },
  order: { type: Number, default: 0 } // To sort them if needed
}, {
  timestamps: true,
});

const RunwayVideo = mongoose.model('RunwayVideo', runwayVideoSchema);
module.exports = RunwayVideo;