const express = require("express");
const router = express.Router();

const {registerUser, login, logout} = require("../controller/userController");

router.post("/register", registerUser);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;