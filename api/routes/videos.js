const {
  addVideo,
  deleteVideo,
  getVideo,
  updateVideo,
  addView,
  trends,
  random,
  subscribed,
  getByTag,
  Search,
} = require("../controllers/video");

const router = require("express").Router();

router.post("/", addVideo);

router.delete("/:id", deleteVideo);

router.get("/find/:id", getVideo);

router.put("/:id", updateVideo);

router.put("/view/:id", addView);

router.get("/trend", trends);

router.get("/random", random);

router.get("/sub", subscribed);

router.get("/tags", getByTag);

router.get("/search", Search);

module.exports = router;
