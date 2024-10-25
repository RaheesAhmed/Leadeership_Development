import { supabaseClient } from "../lib/supabaseClient.js";
import logger from "../utils/logger.js";

const auth = async (req, res, next) => {
  try {
    // Check for token in cookies first
    let token = req.cookies.token;

    // If no token in cookies, check Authorization header
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.replace("Bearer ", "");
    }

    if (!token) {
      logger.error("No token provided");
      return res.status(401).json({ message: "Authentication required" });
    }

    // Verify token with Supabase
    const {
      data: { user },
      error,
    } = await supabaseClient.auth.getUser(token);

    if (error || !user) {
      logger.error("User not found or unauthorized");
      throw error || new Error("User not found");
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    logger.error("Auth middleware error:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
};

export default auth;
