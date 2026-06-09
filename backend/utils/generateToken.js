import jwt from "jsonwebtoken";
import { getPrivateKey } from "./pki.js";

export const generateToken = (userId) =>
  jwt.sign({ userId }, getPrivateKey(), {
    algorithm: "RS256",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

