const mongoose = require('mongoose');

const collectionSchema = mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },

  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
});

const Collection = mongoose.model('Collection', collectionSchema);
module.exports = Collection;