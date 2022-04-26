const express = require("express");
const router = express.Router();

const {registerUser, login, logout, forgotPassword, resetPassword, getUserDetails, changePassword} = require("../controller/userController");
const { isSignedIn } = require("../middleware/userMiddleware");

router.post("/register", registerUser);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.get("/userDetails", isSignedIn, getUserDetails);
router.post("/changePassword", isSignedIn, changePassword);

module.exports = router;