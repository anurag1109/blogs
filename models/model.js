const mongoose = require("mongoose");

const userschema = mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  gender: { type: String },
  role: {
    type: String,
    required: true,
    enum: ["User", "Moderator"],
    default: "User",
  },
});

const usermodel = mongoose.model("users", userschema);

const blogschema = mongoose.Schema({
  blog_id: { type: Number },
  blog_name: { type: String },
  no_of_likes: { type: Number },
  no_of_comments: { type: Number },
});

const blogmodel = mongoose.model("blogs", blogschema);

const blacklistschema = mongoose.Schema({
  token: { type: String },
});

const blacklistmodel = mongoose.model("blacklist", blacklistschema);

module.exports = { usermodel, blogmodel, blacklistmodel };
