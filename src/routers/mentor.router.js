const express = require("express");
const {
  createMentorController,
  loginMentorController,
  logoutMentorController,
  logoutAllMentorsController,
  getMentorProfileController,
  updateMentorController,
  deleteMentorController,
} = require("../controllers/mentor.controller");

const { authMentor } = require("../middleware/auth");

const router = new express.Router();

router.post("/mentor", createMentorController);
router.post("/mentor/login", loginMentorController);
router.post("/mentor/logout", authMentor, logoutMentorController);
router.post("/mentor/logoutAll", authMentor, logoutAllMentorsController);
router.get("/mentor/me", authMentor, getMentorProfileController);
router.patch("/mentor/me", authMentor, updateMentorController);
router.delete("/mentor/me", authMentor, deleteMentorController);

module.exports = router;
