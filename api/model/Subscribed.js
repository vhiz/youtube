const { model, Schema } = require("mongoose");

const subscribedSchema = new Schema(
  {
    followerUserId: {
      type: String,
    },
    followedUserId: {
      type: String,
    },
  },
  { timestamps: true }
);

const Subcribed = model("Subcribed", subscribedSchema);

module.exports = { Subcribed };
