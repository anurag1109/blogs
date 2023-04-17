const jwt = require("jsonwebtoken");
const { blacklistmodel, usermodel } = require("../models/model");
const express = require("express");
const app = express();
app.use(express.json());
const authenticate = async (req, res, next) => {
  try {
    const accesstoken = JSON.parse(req.headers.authorization);
    console.log(accesstoken);
    if (accesstoken) {
      let blacklistedtoken = await blacklistmodel.find({ token: accesstoken });
      console.log(blacklistedtoken);
      if (blacklistedtoken.length > 0) {
        res
          .status(200)
          .send({ msg: "This token has been used already,Please login again" });
      } else {
        jwt.verify(accesstoken, "accesstokenkey", async (err, decoded) => {
          console.log(decoded);
          if (decoded) {
            // req.body.user = decoded.userId;
            const { userId } = decoded;
            const user = await usermodel.findOne({ _id: userId });
            const role = user?.role;
            req.role = role;
            req.body.user = decoded.userId;
            console.log(req.body);
            next();
          } else {
            res.status(200).send({ msg: err.message });
          }
        });
      }
    } else {
      res.status(200).send({ msg: "Please login first" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.message });
  }
};

const authorise = function (permittedrole) {
  return (req, res, next) => {
    if (permittedrole.includes(req.role)) {
      next();
    } else {
      res.status(401).send({ msg: "You are not authorised" });
    }
  };
};

module.exports = { authenticate, authorise };
