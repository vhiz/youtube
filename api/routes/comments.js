const {
  addComment,
  getAllComments,
  deleteComments,
} = require("../controllers/comments");

const router = require("express").Router();

router.post("/:id", addComment);

router.get("/:videoId", getAllComments);

router.delete("/:id", deleteComments);

module.exports = router;
