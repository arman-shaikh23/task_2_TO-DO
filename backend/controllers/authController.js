import User from "../models/User.js";
import Todo from "../models/Todo.js";
import { isStrongPassword } from "../utils/validators.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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

const persistSession = (req, userId, rememberMe) =>
  new Promise((resolve, reject) => {
    req.session.userId = userId.toString();
    req.session.rememberMe = Boolean(rememberMe);

    if (rememberMe) {
      req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
    } else {
      req.session.cookie.expires = false;
    }

    req.session.save((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

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
  await persistSession(req, user._id, rememberMe);
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

  await persistSession(req, user._id, rememberMe);
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
    rememberMe: Boolean(req.session.rememberMe),
    stats: {
      totalTasks: todos.length,
      completedTasks,
      productivityScore,
    },
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
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
  req.session.destroy(() => {
    res.clearCookie("taskflow.sid");
    res.json({ message: "Logged out successfully" });
  });
});
