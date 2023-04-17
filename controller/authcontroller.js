const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { usermodel, blacklistmodel } = require("../models/model");

const register = async (req, res) => {
  const { name, email, password, gender, role } = req.body;
  try {
    if (await usermodel.findOne({ email })) {
      res.send({ msg: "User already exists,please login" });
    } else {
      const hashedpass = await bcrypt.hash(password, 5);
      const hasheduser = new usermodel({
        name,
        email,
        password: hashedpass,
        gender,
        role,
      });
      await hasheduser.save();
      res.status(200).send({ msg: "user has been registered" });
    }
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const isuserexist = await usermodel.findOne({ email });

    if (!isuserexist) {
      res.status(200).send({ msg: "user not exist, please login first" });
    } else if (!(await bcrypt.compare(password, isuserexist.password))) {
      res.status(200).send({ msg: "password is not correct" });
    } else {
      const accesstoken = jwt.sign(
        { userId: isuserexist._id },
        "accesstokenkey",
        { expiresIn: "1m" }
      );
      const refreshstoken = jwt.sign(
        { userId: isuserexist._id },
        "refreshtokenkey",
        { expiresIn: "3m" }
      );
      res
        .status(200)
        .send({ msg: "Login successful", accesstoken, refreshstoken });
    }
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
};

const logout = async (req, res) => {
  const accesstoken = JSON.parse(req.headers.authorization);
  const accessblacklist = new blacklistmodel({
    token: accesstoken,
  });
  await accessblacklist.save();
  // const refreshblacklist = new blacklistModel({
  //   token: refreshtoken,
  // });
  // await refreshblacklist.save();
  // blacklists.push(token);
  res.send({ msg: "Logout successful" });
};

const newtoken = async (req, res) => {
  try {
    const refreshtoken = JSON.parse(req.headers.authorization);
    const decoded = jwt.verify(refreshtoken, "refreshtokenkey");
    if (decoded) {
      const token = jwt.sign({ userId: decoded.userId }, "accesstokenkey", {
        expiresIn: "1m",
      });
      res.status(200).send({ accesstoken: token });
    } else {
      res.send({ msg: "Invalid refresh token,please login first" });
    }
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
};

module.exports = { register, login, logout, newtoken };
