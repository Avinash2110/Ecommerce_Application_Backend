const express = require("express");
const router = express.Router();

const {registerUser, login, logout, forgotPassword} = require("../controller/userController");

router.post("/register", registerUser);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgotPassword", forgotPassword);

module.exports = router;