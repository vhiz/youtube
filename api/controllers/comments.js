const { verify } = require("jsonwebtoken");
const { Comment } = require("../model/Comments");
const { Video } = require("../model/Video");
require("dotenv/config");

const addComment = async (req, res) => {
  // const token = req.cookies.youtubeToken;
  // if (!token) return res.status(401).json("Not Authenticated");

  // verify(token, process.env.KEY, async (err, payload) => {
  //   if (err) return res.status(403).json("Token Not Valid");
    const userId = req.params.id;
    try {
      const newComment = await Comment.create({ ...req.body, userId: userId });
      res.status(201).json(newComment);
    } catch (error) {
      res.status(400).json(error.message);
    }
  // });
};

const getAllComments = async (req, res) => {
  try {
    const allComments = await Comment.find({ videoId: req.params.videoId });
    res.status(200).json(allComments.sort((a, b) => b.createdAt - a.createdAt));
  } catch (error) {}
};

const deleteComments = async (req, res) => {
  const token = req.cookies.youtubeToken;
  if (!token) return res.status(401).json("Not Authenticated");

  verify(token, process.env.KEY, async (err, payload) => {
    if (err) return res.status(403).json("Token Not Valid");
    const userId = payload.id;

    const comment = await Comment.findById(req.params.id);

    const video = await Video.findById(comment.userId);

    if (userId === comment.userId || userId === video.userId) {
      await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json("comment deleted");
    } else {
      return res.status(403).json("not autorised");
    }
  });
};

module.exports = { deleteComments, addComment, getAllComments };
