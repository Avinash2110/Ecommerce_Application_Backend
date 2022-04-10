const express = require("express");
const router = express.Router();

const {registerUser, login, logout, forgotPassword, resetPassword, getUserDetails} = require("../controller/userController");
const { isSignedIn } = require("../middleware/userMiddleware");

router.post("/register", registerUser);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.get("/userDetails", isSignedIn, getUserDetails);

module.exports = router;