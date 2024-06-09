import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

// single model for user, admin & superAdmin
// required fileds are :- username, email, password
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "please enter your Name"],
      maxLength: [30, "Name cannot exceed 30 characters"],
      minLength: [4, "Name should have more than 4 characters"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "please enter your Email"],
      validate: [validator.isEmail, "please enter a valid Email !!"],
    },
    password: {
      type: String,
      required: [true, "please enter your Password"],
      minLength: [8, "Name should have more than 8 characters"],
      // select: false,
    },
    avatar: {
      type: String, //cloudinary
      // required: true,
    },
    role: {
      type: String,
      default: "user", //default role is user and updates automatically as per requests
    },

    refreshToken: String, // new refresh token is generated on userLogin and adminLogin

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// compare password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// tokens will be added in controllers file
// access token generation logic only
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// refresh token generation logic only
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

// reset password token method, NOT COMPLETED
userSchema.methods.getResetPasswordToken = async function () {
  const resetToken = nanoid(20);
  console.log(resetToken);
  // this.resetPasswordToken = crypto
  //   .createHash("sha256")
  //   .update(resetToken)
  //   .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

export const User = new mongoose.model("User", userSchema);
