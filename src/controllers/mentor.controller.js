const asyncHandler = require("express-async-handler");
const Mentor = require("../models/mentor");

const createMentorController = asyncHandler(async (req, res) => {
  const mentor = new Mentor(req.body);
  try {
    const token = await mentor.generateAuthToken();
    await mentor.save();

    res.status(201).send({ mentor, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

const loginMentorController = asyncHandler(async (req, res) => {
  try {
    const mentor = await Mentor.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await mentor.generateAuthToken();

    res.send({ mentor, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

const logoutMentorController = asyncHandler(async (req, res) => {
  try {
    req.mentor.tokens = req.mentor.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.mentor.save();

    res.send({ message: "Logout successful", mentor: req.mentor });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const logoutAllMentorsController = asyncHandler(async (req, res) => {
  try {
    req.mentor.tokens = [];
    await req.mentor.save();

    res.send({ message: "Logout successful", mentor: req.mentor });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const getMentorProfileController = asyncHandler(async (req, res) => {
  res.send(req.mentor);
});

const updateMentorController = asyncHandler(async (req, res) => {
  const allowedUpdates = [
    "name",
    "email",
    "phone",
    "address",
    "bio",
    "dob",
    "education_qualification",
    "domains",
    "industry",
    "experience",
    "linkedin",
    "achievements",
    "password",
  ];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({
      error: "Invalid updates",
    });
  } else {
    try {
      updates.forEach((update) => (req.mentor[update] = req.body[update]));
      await req.mentor.save();
      res.send(req.mentor);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
});

const deleteMentorController = asyncHandler(async (req, res) => {
  try {
    await req.mentor.remove();

    res.send(req.mentor);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = {
  createMentorController,
  loginMentorController,
  logoutMentorController,
  logoutAllMentorsController,
  getMentorProfileController,
  updateMentorController,
  deleteMentorController,
};
