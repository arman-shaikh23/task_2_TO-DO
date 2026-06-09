import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { decryptPayload, getPublicKey } from "../utils/pki.js";

export const protect = async (req, res, next) => {
  const token = req.cookies["taskflow.accessToken"];
  
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, getPublicKey(), { algorithms: ["RS256"] });
    const decryptedPayload = decryptPayload(decoded.data);

    req.user = await User.findById(decryptedPayload.userId).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Token Versioning: Verify the token was issued for the current version
    if (req.user.tokenVersion !== decryptedPayload.tokenVersion) {
      return res.status(401).json({ message: "Token revoked" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
