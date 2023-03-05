const { verify } = require("jsonwebtoken");
const { Subcribed } = require("../model/Subscribed");
const { User } = require("../model/User");

const getSubcribed = async (req, res) => {
  const {
    query: { followedUserId },
  } = req;

  const relationships = await Subcribed.find({
    followedUserId: followedUserId,
  });

  res
    .status(200)
    .send(relationships.map((relationship) => relationship.followerUserId));
};

const addSubcribers = async (req, res) => {
  const token = req.cookies.youtubeToken;
  if (!token) return res.status(401).json("Not verified");

  verify(token, process.env.KEY, async (err, userInfo) => {
    if (err) return res.status(403).json("token is not verified");

    const userId = userInfo.id;
    const currentUser = await User.findById(userId);

    if (!currentUser.subscribedUsers.includes(req.params.id)) {
      await User.findByIdAndUpdate(userId, {
        $push: { subscribedUsers: req.params.id },
      });
      await User.findByIdAndUpdate(req.params.id, {
        $inc: { subscribers: 1 },
      });

      const newRelationship = new Subcribed({
        followerUserId: userId,
        followedUserId: req.params.id,
      });
      await newRelationship.save();
      return res.status(200).send("user has been followed");
    } else {
      res.status(401).send("you are already following this user");
    }
  });
};

const deleteSubcribers = async (req, res) => {
  const token = req.cookies.youtubeToken;
  if (!token) return res.status(401).json("Not verified");

  verify(token, process.env.KEY, async (err, userInfo) => {
    if (err) return res.status(403).json("token is not verified");

    const userId = userInfo.id;
    const currentUser = await User.findById(userId);

    if (currentUser.subscribedUsers.includes(req.params.id)) {
      await User.findByIdAndUpdate(userId, {
        $pull: { subscribedUsers: req.params.id },
      });
      await User.findByIdAndUpdate(req.params.id, {
        $inc: { subscribers: -1 },
      });

      await Subcribed.findOneAndDelete(
        { followerUserId: userId },
        { followedUserId: req.params.id }
      );
      return res.status(200).send("user has been unfollowed");
    } else {
      res.status(401).send("you are already unfollowing this user");
    }
  });
};

module.exports = { deleteSubcribers, addSubcribers, getSubcribed };
