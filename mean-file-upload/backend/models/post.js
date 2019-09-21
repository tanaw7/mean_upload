const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const postSchema = mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true }
});

postSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Post', postSchema);
