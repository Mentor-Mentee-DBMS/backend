const asyncHandler = require("express-async-handler");
const Mentee = require("../models/mentee");
const Mentor = require("../models/mentor");

const createMenteeController = asyncHandler(async (req, res) => {
  const mentee = new Mentee(req.body);
  try {
    const token = await mentee.generateAuthToken();
    await mentee.save();

    res.status(201).send({ mentee, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

const loginMenteeController = asyncHandler(async (req, res) => {
  try {
    const mentee = await Mentee.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await mentee.generateAuthToken();

    res.send({ mentee, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

const logoutMenteeController = asyncHandler(async (req, res) => {
  try {
    req.mentee.tokens = req.mentee.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.mentee.save();

    res.send({ message: "Logout successful", mentee: req.mentee });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const logoutAllMenteesController = asyncHandler(async (req, res) => {
  try {
    req.mentee.tokens = [];
    await req.mentee.save();

    res.send({ message: "Logout successful", mentee: req.mentee });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const getMenteeProfileController = asyncHandler(async (req, res) => {
  res.send(req.mentee);
});

const updateMenteeController = asyncHandler(async (req, res) => {
  const allowedUpdates = [
    "name",
    "email",
    "phone",
    "address",
    "bio",
    "dob",
    "education_qualification",
    "institute",
    "domains",
    "linkedin",
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
      updates.forEach((update) => (req.mentee[update] = req.body[update]));
      await req.mentee.save();
      res.send(req.mentee);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
});

const deleteMenteeController = asyncHandler(async (req, res) => {
  try {
    await req.mentee.remove();

    res.send(req.mentee);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const getAllMentorsController = asyncHandler(async (req, res) => {
  const mentors = await Mentor.find();
  res.send(mentors);
});

module.exports = {
  createMenteeController,
  loginMenteeController,
  logoutMenteeController,
  logoutAllMenteesController,
  getMenteeProfileController,
  updateMenteeController,
  deleteMenteeController,
  getAllMentorsController,
};
