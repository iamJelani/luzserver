const express = require("express");
const bcryptjs = require("bcryptjs");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const auth = require("../middlewere.js/auth");

const authRouter = express.Router();

authRouter.post("/sign-up", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ msg: "User already exists!" });
    }
    const hashedPassword = await bcryptjs.hash(password, 8);

    let user = new User({
      name,
      email,
      password: hashedPassword,
    });
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

authRouter.post("/sign-in", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Wrong Password" });
    }
    const token = jwt.sign({ id: user._id }, "Quiet");
    res.json({ token, ...user._doc });
  } catch (e) {
    res.status(500).json({ msg: "Could not sign in" });
    console.log(`Could not sign in: ${e}`);
  }
});

authRouter.post("/verify-token", async (req, res) => {
  try {
    const token = req.header("x-Lukas-Token");
    if (!token) return res.json(false);
    const verified = jwt.verify(token, "Quiet");
    if (!verified) return res.json(false);
    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    res.json(true);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

authRouter.get("/", auth, async (req, res) => {
  console.log("Token Verified555");
  const user = await User.findById(req.user);
  res.json({ ...user._doc, token: req.token });
  // console.log("This is req_user_info:" + res);
});
module.exports = authRouter;
