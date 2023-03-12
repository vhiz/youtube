const { genSaltSync, hashSync } = require("bcryptjs");
const { verify } = require("jsonwebtoken");
const { User } = require("../model/User");
const { Video } = require("../model/Video");

require("dotenv/config");

const getUser = async (req, res) => {
  const token = req.cookies.youtubeToken;
  if (!token) return res.status(401).json("Not Authenticated");

  verify(token, process.env.KEY, async (err, payload) => {
    if (err) return res.status(403).json("Token Not Valid");
    const userId = payload.id;
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json("User not found");

      const { password, ...other } = user._doc;
      res.status(200).json(other);
    } catch (error) {
      res.status(500).json(error);
    }
  });
};

const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json("User not found");

    const { password, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateUser = async (req, res) => {
  const token = req.cookies.youtubeToken;
  if (!token) return res.status(401).json("Not Authenticated");

  verify(token, process.env.KEY, async (err, payload) => {
    if (err) return res.status(403).json("Token Not Valid");
    const userId = payload.id;
    try {
      if (req.body.password) {
        const salt = genSaltSync(10);
        req.body.password = hashSync(req.body.password, salt);
      }
      const update = await User.findByIdAndUpdate(
        userId,
        {
          $set: req.body,
        },
        { new: true }
      );

      const { password, ...other } = update._doc;
      res.status(200).json(other);
    } catch (error) {
      res.status(500).json(error);
    }
  });
};

const deleteUser = async (req, res) => {
  const token = req.cookies.youtubeToken;
  if (!token) return res.status(401).json("Not Authenticated");

  verify(token, process.env.KEY, async (err, payload) => {
    if (err) return res.status(403).json("Token Not Valid");
    const userId = payload.id;
    try {
      await User.findByIdAndDelete(userId);
      res.status(200).json("deleted succesfully");
    } catch (error) {
      res.status(500).json(error);
    }
  });
};

const subscribe = async (req, res) => {
  // const token = req.cookies.youtubeToken;
  // if (!token) return res.status(401).json("Not Authenticated");

  // verify(token, process.env.KEY, async (err, payload) => {
  //   if (err) return res.status(403).json("Token Not Valid");
    const userId = req.params.id;

    try {
      await User.findByIdAndUpdate(userId, {
        $push: { subscribedUsers: req.params.id },
      });
      await User.findByIdAndUpdate(req.params.id, {
        $inc: { subscribers: 1 },
      });

      res.status(200).json("subcribed to channel");
    } catch (error) {
      res.status(400).json(error);
    }
  // });
};

const unsubscribe = async (req, res) => {
  // const token = req.cookies.youtubeToken;
  // if (!token) return res.status(401).json("Not Authenticated");

  // verify(token, process.env.KEY, async (err, payload) => {
  //   if (err) return res.status(403).json("Token Not Valid");
    const userId = req.params.id;

    try {
      await User.findByIdAndUpdate(userId, {
        $pull: { subscribedUsers: req.params.id },
      });
      await User.findByIdAndUpdate(req.params.id, {
        $inc: { subscribers: -1 },
      });

      res.status(200).json("unsubcribed to channel");
    } catch (error) {
      res.status(400).json(error);
    }
  // });
};

const like = async (req, res) => {
  // const token = req.cookies.youtubeToken;
  // if (!token) return res.status(401).json("Not Authenticated");

  // verify(token, process.env.KEY, async (err, payload) => {
  //   if (err) return res.status(403).json("Token Not Valid");
    const userId = req.params.id;

    await Video.findByIdAndUpdate(req.params.videoId, {
      $addToSet: { likes: userId },
      $pull: { dislikes: userId },
    });

    res.status(200).json("liked video");
  // });
};

const dislike = async (req, res) => {
  // const token = req.cookies.youtubeToken;
  // if (!token) return res.status(401).json("Not Authenticated");

  // verify(token, process.env.KEY, async (err, payload) => {
  //   if (err) return res.status(403).json("Token Not Valid");
    const userId = req.params.id;

    await Video.findByIdAndUpdate(req.params.videoId, {
      $addToSet: { dislikes: userId },
      $pull: { likes: userId },
    });

    res.status(200).json("unliked video");
  // });
};
module.exports = {
  getUser,
  updateUser,
  deleteUser,
  subscribe,
  unsubscribe,
  like,
  dislike,
  getUserById,
};
