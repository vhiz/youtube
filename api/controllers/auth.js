const { genSaltSync, hashSync, compareSync } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { User } = require("../model/User");
require("dotenv/config");

const Register = async (req, res) => {
  const salt = genSaltSync(10);
  const password = hashSync(req.body.password, salt);
  const userExixt = await User.findOne({
    name: { $regex: req.body.name, $options: "i" },
  });
  if (userExixt) return res.status(409).json("user already exist");

  const emailExixt = await User.findOne({
    email: { $regex: req.body.email, $options: "i" },
  });
  if (emailExixt) return res.status(409).json("user already exist");
  try {
    const newUser = await User.create({
      name: req.body.name,
      password: password,
      email: req.body.email,
    });

    const token = sign({ id: newUser._id }, process.env.KEY);
    const { password, ...other } = newUser._doc;
    res
      .cookie("youtubeToken", token, { httpOnly: true })
      .status(201)
      .json(other);
  } catch (error) {
    res.status(400).json(error);
  }
};

const Login = async (req, res) => {
  try {
    const user = await User.findOne({
      email: { $regex: req.body.email, $options: "i" },
    });
    if (!user) return res.status(404).json("Not Found");

    const compare = compareSync(req.body.password, user.password);
    if (!compare) return res.status(401).json("Invalid password");

    const token = sign({ id: user._id }, process.env.KEY);

    const { password, ...other } = user._doc;
    res
      .cookie("youtubeToken", token, { httpOnly: true })
      .status(200)
      .json(other);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const Google = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = sign({ id: user._id }, process.env.KEY);
      const { password, ...other } = user._doc;
      res
        .cookie("youtubeToken", token, { httpOnly: true })
        .status(200)
        .json(other);
    } else {
      const newUser = await User.create({
        ...req.body,
        fromGoogle: true,
      });

      const token = sign({ id: newUser._id }, process.env.KEY);
      const { password, ...other } = newUser._doc;
      res
        .cookie("youtubeToken", token, { httpOnly: true })
        .status(200)
        .json(other);
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const Logout = async (req, res) => {
  res
    .cookie("youtubeToken", "", { httpOnly: true })
    .status(200)
    .json("Loged out");
};

module.exports = { Register, Login, Google, Logout };
