import mongoose from "mongoose";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import config from "../config/index.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  quizes: [
    {
      quiz_id: String,
    },
  ],
  polls: [
    {
      poll_id: String,
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods = {
  comparePassword: async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  },

  getJwtAccessToken: function () {
    return JWT.sign({ _id: this._id }, config.ACCESS_TOKEN, {
      expiresIn: config.ACCESS_TOKEN_EXPIRY,
    });
  },
  getJwtRefreshToken: function () {
    return JWT.sign({ _id: this._id }, config.REFRESH_TOKEN, {
      expiresIn: config.REF_TOKEN_EXPIRY,
    });
  },
};

const User = mongoose.model("User", userSchema);

export default User;
