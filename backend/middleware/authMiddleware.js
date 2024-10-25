import { supabaseClient } from "../lib/supabaseClient.js";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

export const requireAuth = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      logger.error("No token provided");
      return res.status(401).json({ error: "Authentication required" });
    }

    try {
      // Verify token using JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      logger.error("Token verification failed:", error);
      res.clearCookie("token"); // Clear invalid token
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  } catch (error) {
    logger.error("Auth middleware error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
};

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
