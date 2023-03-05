const { Register, Login, Google, Logout } = require("../controllers/auth");

const router = require("express").Router();

router.post("/register", Register);

router.post("/login", Login);

router.post("/google", Google);

router.post("/logout", Logout);

module.exports = router;
