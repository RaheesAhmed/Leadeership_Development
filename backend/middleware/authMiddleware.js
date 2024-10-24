import jwt from "jsonwebtoken";
import { supabaseClient } from "../lib/supabaseClient.js";
import logger from "../utils/logger.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const protect = async (req, res, next) => {
  try {
    // Get token from header or cookies
    let token = req.headers.authorization?.replace("Bearer ", "");

    if (!token && req.cookies) {
      token = req.cookies.token;
    }

    if (!token) {
      logger.error("No token provided");
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user from database
    const { data: user, error } = await supabaseClient
      .from("users")
      .select("*")
      .eq("id", decoded.id)
      .single();

    if (error || !user) {
      logger.error("User not found or unauthorized");
      return res.status(401).json({ message: "Not authorized" });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    logger.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Not authorized" });
  }
};
