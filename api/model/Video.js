const { Schema, model } = require("mongoose");

const videoSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
    },
    likes: {
      type: [String],
    },
    dislikes: {
      type: [String],
    },
  },
  { timestamps: true }
);

const Video = model("Video", videoSchema);

module.exports = { Video };
