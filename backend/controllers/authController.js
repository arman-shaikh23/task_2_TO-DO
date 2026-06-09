import User from "../models/User.js";
import Todo from "../models/Todo.js";
import RefreshToken from "../models/RefreshToken.js";
import { isStrongPassword } from "../utils/validators.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { encryptPayload } from "../utils/pki.js";
import crypto from "crypto";

const buildAuthPayload = (user, rememberMe = false) => ({
  isAuthenticated: true,
  rememberMe,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  },
});

const issueTokens = async (res, user, rememberMe) => {
  // 1. Generate Access Token (Short-lived: 15 minutes)
  const payload = { userId: user._id.toString(), tokenVersion: user.tokenVersion };
  const encryptedData = encryptPayload(payload);
  
  const accessToken = jwt.sign({ data: encryptedData }, process.env.JWT_SECRET || "taskflow-dev-secret", {
    expiresIn: "15m",
  });

  // 2. Generate Refresh Token (Long-lived: 7 days)
  const refreshTokenString = crypto.randomBytes(40).toString("hex");
  const refreshTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

  await RefreshToken.create({
    token: refreshTokenString,
    user: user._id,
    expiresAt: refreshTokenExpiresAt,
  });

  const isProduction = process.env.NODE_ENV === "production";
  
  // 3. Set Cookies
  res.cookie("taskflow.accessToken", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    maxAge: 1000 * 60 * 15, // 15 minutes
  });

  res.cookie("taskflow.refreshToken", refreshTokenString, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    maxAge: rememberMe ? 1000 * 60 * 60 * 24 * 7 : undefined, // 7 days or session
  });
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, rememberMe } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      message: "Password must be 8+ chars with uppercase, lowercase and number",
    });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const user = await User.create({ name, email, password });
  await issueTokens(res, user, rememberMe);
  res.status(201).json(buildAuthPayload(user, rememberMe));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  await issueTokens(res, user, rememberMe);
  res.json(buildAuthPayload(user, rememberMe));
});

export const getProfile = asyncHandler(async (req, res) => {
  const todos = await Todo.find({ user: req.user._id });
  const completedTasks = todos.filter((todo) => todo.status === "completed").length;
  const productivityScore = todos.length
    ? Math.round((completedTasks / todos.length) * 100)
    : 0;

  res.json({
    user: req.user,
    rememberMe: true,
    stats: {
      totalTasks: todos.length,
      completedTasks,
      productivityScore,
    },
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const normalizedEmail = email?.trim().toLowerCase();
  if (normalizedEmail && normalizedEmail !== user.email) {
    const existingUser = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }
  }

  user.name = name?.trim() || user.name;
  user.email = normalizedEmail || user.email;

  if (password) {
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message: "Password must be 8+ chars with uppercase, lowercase and number",
      });
    }
    user.password = password;
    user.tokenVersion += 1; // Invalidate all existing tokens globally
    await RefreshToken.deleteMany({ user: user._id }); // Clear all refresh tokens
  }

  const updated = await user.save();

  res.json({
    user: {
      id: updated._id,
      name: updated.name,
      email: updated.email,
    },
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies["taskflow.refreshToken"];
  
  if (refreshToken) {
    await RefreshToken.findOneAndDelete({ token: refreshToken });
  }

  res.clearCookie("taskflow.accessToken");
  res.clearCookie("taskflow.refreshToken");
  res.json({ message: "Logged out successfully" });
});

export const refreshTokenUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies["taskflow.refreshToken"];

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  // 1. Find and validate the refresh token
  const existingToken = await RefreshToken.findOne({ token: refreshToken });

  if (!existingToken) {
    // Optional: Detect reuse. If we tracked families, we could invalidate all here.
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  if (existingToken.expiresAt < new Date()) {
    await RefreshToken.deleteOne({ _id: existingToken._id });
    return res.status(401).json({ message: "Refresh token expired" });
  }

  // 2. Refresh Token Rotation: Delete the old one
  await RefreshToken.deleteOne({ _id: existingToken._id });

  // 3. Find the user to ensure they still exist and to get their current tokenVersion
  const user = await User.findById(existingToken.user);
  if (!user) {
    return res.status(401).json({ message: "User no longer exists" });
  }

  // 4. Issue a fresh pair of tokens
  // If the user had a session cookie, preserve that behavior
  const isSessionCookie = !req.cookies["taskflow.refreshToken"]?.maxAge; // basic heuristic
  await issueTokens(res, user, !isSessionCookie);

  res.json({ message: "Tokens refreshed successfully" });
});
