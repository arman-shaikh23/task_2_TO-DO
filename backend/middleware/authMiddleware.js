import User from "../models/User.js";

export const protect = async (req, res, next) => {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    req.user = await User.findById(req.session.userId).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid session" });
  }
};
