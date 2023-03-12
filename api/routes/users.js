const {
  getUser,
  updateUser,
  deleteUser,
  subscribe,
  unsubscribe,
  like,
  dislike,
  getUserById,
} = require("../controllers/users");

const router = require("express").Router();

router.get("/", getUser);

router.get("/find/:id", getUserById);

router.put("/", updateUser);

router.delete("/", deleteUser);

router.put("/sub/:id", subscribe);

router.put("/unsub/:id", unsubscribe);

router.put("/like/:videoId/:id", like);

router.put("/dislike/:videoId/:id", dislike);

module.exports = router;
