const express = require("express");
const {
  createMenteeController,
  loginMenteeController,
  logoutMenteeController,
  logoutAllMenteesController,
  getMenteeProfileController,
  updateMenteeController,
  deleteMenteeController,
  getAllMentorsController,
} = require("../controllers/mentee.controller");

const { authMentee } = require("../middleware/auth");

const router = new express.Router();

router.post("/mentee", createMenteeController);
router.post("/mentee/login", loginMenteeController);
router.post("/mentee/logout", authMentee, logoutMenteeController);
router.post("/mentee/logoutAll", authMentee, logoutAllMenteesController);
router.get("/mentee/me", authMentee, getMenteeProfileController);
router.patch("/mentee/me", authMentee, updateMenteeController);
router.delete("/mentee/me", authMentee, deleteMenteeController);
router.get("/mentee/mentors", authMentee, getAllMentorsController);

module.exports = router;
