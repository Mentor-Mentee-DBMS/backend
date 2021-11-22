const jwt = require("jsonwebtoken");
const Mentor = require("../models/mentor");
const Mentee = require("../models/mentee");

const authMentor = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const mentor = await Mentor.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!mentor) {
      throw new Error();
    } else {
      req.token = token;
      req.mentor = mentor;
      next();
    }
  } catch (error) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

const authMentee = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const mentee = await Mentee.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!mentee) {
      throw new Error();
    } else {
      req.token = token;
      req.mentee = mentee;
      next();
    }
  } catch (error) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = { authMentor, authMentee };
