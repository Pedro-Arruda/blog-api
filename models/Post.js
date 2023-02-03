const mongoose = require("mongoose");

const Post = mongoose.model("Post", {
  title: String,
  imgCover: String,
  content: String,
  tags: Array,
  createdAt: String,
  author: String,
  active: Boolean,
});

module.exports = Post;
