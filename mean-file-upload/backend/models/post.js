const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true }
});

module.exports = mongoose.model('Post', postSchema);
