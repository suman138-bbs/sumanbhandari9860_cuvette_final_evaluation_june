import config from "../config/index.js";
import User from "../models/user.model.js";
import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/CustomError.js";
import JWT from "jsonwebtoken";
export const cookieOptions = {
  expires: new Date(Date.now() + 30 * 60 * 1000),
  httpOnly: true,
  sameSite: "None",
  secure: true,
  // domain: "https://frontend-quizzie.vercel.app",
};

export const signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  console.log("EMAIL", email);
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ sucess: false, message: "Please provide required fields " });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const accessToken = user?.getJwtAccessToken();
  const refreshToken = user?.getJwtRefreshToken();
  user.password = undefined;
  console.log("ACCESS TokenExpiredError", accessToken);
  res.cookie("refresh_token", refreshToken, {
    expires: new Date(Date.now() + 60 * 60 * 1000),

    httpOnly: true,
    sameSite: "None",
    secure: true,
    // domain: "https://frontend-quizzie.vercel.app",
  });
  res.cookie("access_token", accessToken, cookieOptions);

  res.status(200).json({
    success: true,
    accessToken,
    user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    throw new CustomError("Please fill all the fields", 400);
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user || !user.comparePassword(password)) {
    throw new CustomError("Invalid credentials", 400);
  }

  const accessToken = user.getJwtAccessToken();
  const refreshToken = user.getJwtRefreshToken();

  res.cookie("refresh_token", refreshToken, {
    expires: new Date(Date.now() + 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "None",
    secure: true,
    // domain: "https://frontend-quizzie.vercel.app",
  });

  res.cookie("access_token", accessToken, cookieOptions);
  res.status(200).json({ user, accessToken });
});

/**Refresh Token */
export const refresh = asyncHandler(async (req, res) => {
  const refresh_token = req.cookies.refresh_token;
  console.log("REFRESH ", refresh_token);
  const decoded = JWT.verify(refresh_token, config.REFRESH_TOKEN);
  if (!decoded) {
    res.status(400).json({ success: false, message: "Couldn't refreshToken" });
  }
  const id = decoded._id;
  const user = await User.findById(id);
  if (!user) {
    throw new CustomError("Couldn't referesh token", 400);
  }
  const accessToken = user.getJwtAccessToken();

  res.cookie("access_token", accessToken, cookieOptions);
  res.status(200).json({ accessToken });
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie("refresh_token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: "None",
    secure: true,
    // domain: "https://frontend-quizzie.vercel.app",
  });
  res.cookie("access_token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});
