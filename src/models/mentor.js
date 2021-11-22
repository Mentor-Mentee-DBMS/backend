const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Mentee = require("../models/mentee");

const getAge = (dob) => {
  var today = new Date();
  var birthDate = new Date(dob);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const mentorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email!");
        }
      },
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isMobilePhone(value, "any")) {
          throw new Error("Invalid Phone Number!");
        }
      },
    },

    address: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isLength(value, { min: 10 })) {
          throw new Error("Address is too small!");
        }
      },
    },

    dob: {
      type: Date,
      required: true,
      validate(value) {
        if (value > new Date()) {
          throw new Error("Date of Birth must be in the past!");
        } else if (getAge(value) < 18) {
          throw new Error("Mentor must be atleast 18 years old");
        }
      },
    },

    bio: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isLength(value, { min: 10 })) {
          throw new Error("Bio is too short!");
        }
      },
    },

    education_qualification: {
      type: String,
      required: true,
      trim: true,
    },

    domains: {
      type: [String],
      required: true,
      trim: true,
      validate(value) {
        if (value.length < 1) {
          throw new Error("Must have atleast one domain!");
        }
      },
    },

    industry: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Experience must be a positive number!");
        } else if (value % 1 !== 0) {
          throw new Error("Experience must be a whole number!");
        }
      },
    },

    achievements: {
      type: [String],
      trim: true,
    },

    linkedin: {
      type: String,
      trim: true,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL!");
        }
      },
    },

    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Password should not contain 'password'!");
        }
      },
    },

    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

mentorSchema.virtual("mentees", {
  ref: "Mentee",
  localField: "_id",
  foreignField: "mentor",
});

mentorSchema.methods.toJSON = function () {
  const mentor = this;
  const mentorObject = mentor.toObject();

  delete mentorObject.password;
  delete mentorObject.tokens;

  return mentorObject;
};

mentorSchema.statics.findByCredentials = async (email, password) => {
  const mentor = await Mentor.findOne({ email });

  if (!mentor) {
    throw new Error("Email not found");
  } else {
    const isMatch = await bcrypt.compare(password, mentor.password);

    if (!isMatch) {
      throw new Error("Invalid Email and Password Combination");
    }
  }
  return mentor;
};

mentorSchema.methods.generateAuthToken = async function () {
  const mentor = this;
  const token = jwt.sign(
    { _id: mentor._id.toString() },
    process.env.JWT_SECRET
  );

  mentor.tokens = mentor.tokens.concat({ token });
  await mentor.save();

  return token;
};

// Hashing the password before saving
mentorSchema.pre("save", async function (next) {
  const mentor = this;
  if (mentor.isModified("password")) {
    mentor.password = await bcrypt.hash(mentor.password, 8);
  }
  next();
});

// For cascade delete
mentorSchema.pre("remove", async function (next) {
  const mentor = this;
  //   await Task.deleteMany({ author: mentor._id });
  next();
});

const Mentor = new mongoose.model("Mentor", mentorSchema);

module.exports = Mentor;
