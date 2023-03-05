const { verify } = require("jsonwebtoken");
const { User } = require("../model/User");
const { Video } = require("../model/Video");

const addVideo = async (req, res) => {
  const token = req.cookies.youtubeToken;
  if (!token) return res.status(401).json("Not Authenticated");

  verify(token, process.env.KEY, async (err, payload) => {
    if (err) return res.status(403).json("Token Not Valid");
    const userId = payload.id;

    try {
      const newVideo = await Video.create({
        userId: userId,
        ...req.body,
      });

      res.status(201).json(newVideo);
    } catch (error) {
      res.status(400).json(error);
    }
  });
};

const deleteVideo = async (req, res) => {
  const token = req.cookies.youtubeToken;
  if (!token) return res.status(401).json("Not Authenticated");

  verify(token, process.env.KEY, async (err, payload) => {
    if (err) return res.status(403).json("Token Not Valid");
    const userId = payload.id;

    const video = await Video.findById(req.params.id);
    try {
      if (userId === video.userId) {
        await video.deleteOne();

        res.status(200).json("deleted video");
      } else {
        return res.status(403).json("you can update only your video");
      }
    } catch (error) {
      res.status(400).json(error);
    }
  });
};

const getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    res.status(200).json(video);
  } catch (error) {
    res.status(400).json(error);
  }
};

const updateVideo = async (req, res) => {
  const token = req.cookies.youtubeToken;
  if (!token) return res.status(401).json("Not Authenticated");

  verify(token, process.env.KEY, async (err, payload) => {
    if (err) return res.status(403).json("Token Not Valid");
    const userId = payload.id;

    const video = await Video.findById(req.params.id);
    try {
      if (userId === video.userId) {
        const updatedVideo = await video.updateOne(
          {
            $set: req.body,
          },
          { new: true }
        );

        res.status(200).json(updateVideo);
      } else {
        return res.status(403).json("you can update only your video");
      }
    } catch (error) {
      res.status(400).json(error);
    }
  });
};

const addView = async (req, res) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });

    res.status(200).json("view added");
  } catch (error) {
    res.status(400).json(error);
  }
};

const random = async (req, res) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json(videos);
  } catch (error) {
    res.status(400).json(error);
  }
};

const subscribed = async (req, res) => {
  try {
    const token = req.cookies.youtubeToken;
    if (!token) return res.status(401).json("Not Authenticated");

    verify(token, process.env.KEY, async (err, payload) => {
      if (err) return res.status(403).json("Token Not Valid");
      const userId = payload.id;

      const user = await User.findById(userId);
      const subcribedChannels = user.subscribedUsers;
      const list = await Promise.all(
        subcribedChannels.map((channelId) => {
          return Video.find({ userId: channelId });
        })
      );
      res
        .status(200)
        .json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};
const trends = async (req, res) => {
  try {
    const videos = await Video.find().sort({ views: -1 });
    res.status(200).json(videos);
  } catch (error) {
    res.status(400).json(error);
  }
};

const getByTag = async (req, res) => {
  const tags = req.query.tags.split(",");
  try {
    const videos = await Video.find({ tags: { $in: tags } }).limit(20);
    res.status(200).json(videos);
  } catch (error) {
    res.status(400).json(error);
  }
};

const Search = async (req, res) => {
  const query = req.query.q;
  try {
    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    }).limit(40);
    res.status(200).json(videos);
  } catch (error) {
    res.status(400).json(error);
  }
};
module.exports = {
  updateVideo,
  addVideo,
  deleteVideo,
  getVideo,
  addView,
  random,
  subscribed,
  trends,
  getByTag,
  Search,
};
