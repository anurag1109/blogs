const express = require("express");
const blogrouter = express.Router();
blogrouter.use(express.json());
const jwt = require("jsonwebtoken");
const { blogmodel } = require("../models/model");
const { authenticate, authorise } = require("../middleware/authentication");

blogrouter.get("/", authenticate, async (req, res) => {
  try {
    const blogs = await blogmodel.find();
    res.status(200).send(blogs);
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.message });
  }
});

blogrouter.post("/add", authenticate, authorise(["User"]), async (req, res) => {
  try {
    let blogs = req.body;
    console.log(blogs);
    const newblog = new blogmodel(blogs);
    newblog.save();
    res.status(200).send({ msg: "blog has been added successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.message });
  }
});

blogrouter.delete(
  "/userdelete/:id",
  authenticate,
  authorise(["User"]),
  async (req, res) => {
    try {
      let blogId = req.params.id;
      const accesstoken = JSON.parse(req.headers.authorization);
      jwt.verify(accesstoken, "accesstokenkey", async (err, decoded) => {
        let blog = await blogmodel.findById({
          user: decoded.userId,
          _id: blogId,
        });
        if (blog.length > 0) {
          await blogmodel.findByIdAndDelete({ _id: blogId });
          res.status(200).send({ msg: "blog has been deleted" });
        } else {
          res.status(404).send({ msg: "No such blog found for this user" });
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ msg: err.message });
    }
  }
);

blogrouter.delete(
  "/moderatedelete/:id",
  authenticate,
  authorise(["Moderator"]),
  async (req, res) => {
    try {
      let blogId = req.params.id;
      const accesstoken = JSON.parse(req.headers.authorization);
      jwt.verify(accesstoken, "accesstokenkey", async (err, decoded) => {
        //   let blog = await blogmodel.findById({
        //     user: decoded.userId,
        //     _id: blogId,
        //   });
        //   if (blog.length > 0) {
        await blogmodel.findByIdAndDelete({ _id: blogId });
        res.status(200).send({ msg: "blog has been deleted" });
        //   } else {
        //     res.status(404).send({ msg: "No such blog found for this user" });
        //   }
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ msg: err.message });
    }
  }
);

blogrouter.patch(
  "/userupdate/:id",
  authenticate,
  authorise(["User"]),
  async (req, res) => {
    try {
      let blogId = req.params.id;
      const accesstoken = JSON.parse(req.headers.authorization);
      jwt.verify(accesstoken, "accesstokenkey", async (err, decoded) => {
        let blog = await blogmodel.findById({
          user: decoded.userId,
          _id: blogId,
        });
        if (blog.length > 0) {
          await blogmodel.findByIdAndUpdate({ _id: blogId }, req.body);
          res.status(200).send({ msg: "blog has been deleted" });
        } else {
          res.status(404).send({ msg: "No such blog found for this user" });
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ msg: err.message });
    }
  }
);

module.exports = { blogrouter };
