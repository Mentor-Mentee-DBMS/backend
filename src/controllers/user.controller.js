const asyncHandler = require("express-async-handler");
const User = require("../models/user");

const createUserController = asyncHandler(async (req, res) => {
  const user = new User(req.body);
  try {
    const token = await user.generateAuthToken();
    await user.save();

    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

const loginUserController = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

const logoutUserController = asyncHandler(async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send({ message: "Logout successful", user: req.user });
  } catch (error) {
    res.status(500).send(error);
  }
});

const logoutAllUsersController = asyncHandler(async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send({ message: "Logout successful", user: req.user });
  } catch (error) {
    res.status(500).send(error);
  }
});

const getUserProfileController = asyncHandler(async (req, res) => {
  res.send(req.user);
});

const updateUserController = asyncHandler(async (req, res) => {
  const allowedUpdates = ["name", "email", "age", "password"];
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
      updates.forEach((update) => (req.user[update] = req.body[update]));
      await req.user.save();
      res.send(req.user);
    } catch (error) {
      res.status(400).send(error);
    }
  }
});

const deleteUserController = asyncHandler(async (req, res) => {
  try {
    await req.user.remove();

    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = {
  createUserController,
  loginUserController,
  logoutUserController,
  logoutAllUsersController,
  getUserProfileController,
  updateUserController,
  deleteUserController,
};
