const express = require("express");
const {
  createUserController,
  loginUserController,
  logoutUserController,
  logoutAllUsersController,
  getUserProfileController,
  updateUserController,
  deleteUserController,
} = require("../controllers/user.controller");

const auth = require("../middleware/auth");

const router = new express.Router();

router.post("/users", createUserController);
router.post("/users/login", loginUserController);
router.post("/users/logout", auth, logoutUserController);
router.post("/users/logoutAll", auth, logoutAllUsersController);
router.get("/users/me", auth, getUserProfileController);
router.patch("/users/me", auth, updateUserController);
router.delete("/users/me", auth, deleteUserController);

module.exports = router;
