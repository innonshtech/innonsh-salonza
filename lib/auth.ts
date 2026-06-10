import jwt from "jsonwebtoken";
import { env } from "./env";

export function generateToken(payload: object) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "15m" }); // Changed to 15m for hardening
}

export function generateRefreshToken(payload: object) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "30d" }); // Added refresh token
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}
