const express = require("express");
const router = express.Router();

const {registerUser, login, logout, forgotPassword, resetPassword, getUserDetails, changePassword, updateUser, adminGetUser, managerGetUser, getUserById, adminUpdateUserById, adminRemoveUserById} = require("../controller/userController");
const { isSignedIn, customRole } = require("../middleware/userMiddleware");

router.post("/register", registerUser);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.get("/userDetails", isSignedIn, getUserDetails);
router.post("/changePassword", isSignedIn, changePassword);
router.post("/updateUser", isSignedIn, updateUser);
router.get("/admin/users", isSignedIn, customRole("admin"), adminGetUser);
router.get("/manager/users", isSignedIn, customRole("manager"), managerGetUser);
router.get("/admin/user/:id", isSignedIn, customRole("admin"), getUserById);
router.get("/manager/user/:id", isSignedIn, customRole("manager"), getUserById);
router.put("/admin/user/:id", isSignedIn, customRole("admin"), adminUpdateUserById);
router.delete("/admin/user/:id", isSignedIn, customRole("admin"), adminRemoveUserById);

module.exports = router;