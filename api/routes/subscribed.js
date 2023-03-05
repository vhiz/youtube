const {
  addSubcribers,
  deleteSubcribers,
  getSubcribed,
} = require("../controllers/subscribed");

const router = require("express").Router();

router.get("/", getSubcribed);
router.post("/:id", addSubcribers);
router.delete("/:id", deleteSubcribers);

module.exports = router;
