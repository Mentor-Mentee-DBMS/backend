const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

const menteeSchema = new mongoose.Schema(
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
        } else if (getAge(value) < 10) {
          throw new Error("Mentee must be atleast 10 years old");
        }
      },
    },

    bio: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isLength(value, { min: 10 })) {
          throw new Error("Bio is too small!");
        }
      },
    },

    education_qualification: {
      type: String,
      required: true,
      trim: true,
    },

    institute: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isLength(value, { min: 4 })) {
          throw new Error("Institute name is too small!");
        }
      },
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

menteeSchema.methods.toJSON = function () {
  const mentee = this;
  const menteeObject = mentee.toObject();

  delete menteeObject.password;
  delete menteeObject.tokens;

  return menteeObject;
};

menteeSchema.statics.findByCredentials = async (email, password) => {
  const mentee = await Mentee.findOne({ email });

  if (!mentee) {
    throw new Error("Email not found");
  } else {
    const isMatch = await bcrypt.compare(password, mentee.password);

    if (!isMatch) {
      throw new Error("Invalid Email and Password Combination");
    }
  }
  return mentee;
};

menteeSchema.methods.generateAuthToken = async function () {
  const mentee = this;
  const token = jwt.sign(
    { _id: mentee._id.toString() },
    process.env.JWT_SECRET
  );

  mentee.tokens = mentee.tokens.concat({ token });
  await mentee.save();

  return token;
};

// Hashing the password before saving
menteeSchema.pre("save", async function (next) {
  const mentee = this;
  if (mentee.isModified("password")) {
    mentee.password = await bcrypt.hash(mentee.password, 8);
  }
  next();
});

// For cascade delete
menteeSchema.pre("remove", async function (next) {
  const mentee = this;
  //   await Task.deleteMany({ author: mentee._id });
  next();
});

const Mentee = new mongoose.model("Mentee", menteeSchema);

module.exports = Mentee;
