const express = require("express");
const app = express();
app.use(express.json());

const mongoose = require("mongoose");
require("dotenv").config();

const { connection } = require("./configs/db");
const { userrouter } = require("./routes/userRoutes");
const { blogrouter } = require("./routes/blogsRoute");

app.get("/", async (req, res) => {
  res.send("Homepage");
});

app.use("/users", userrouter);
app.use("/blogs", blogrouter);

app.listen(process.env.port, async (req, res) => {
  try {
    await connection;
    console.log("Connected to mongodb");
  } catch (err) {
    console.log(err);
  }
  console.log(`server is running at port ${process.env.port}`);
});
