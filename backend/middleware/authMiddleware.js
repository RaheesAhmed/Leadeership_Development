import { supabaseClient } from "../lib/supabaseClient.js";
import logger from "../utils/logger.js";

export const requireAuth = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.error("No token provided");
      return res.status(401).json({ error: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];

    // Verify the token with Supabase
    const {
      data: { user },
      error,
    } = await supabaseClient.auth.getUser(token);

    if (error || !user) {
      logger.error("Invalid token:", error);
      return res.status(401).json({ error: "Invalid authentication token" });
    }

    // Add the user object to the request
    req.user = user;
    next();
  } catch (error) {
    logger.error("Auth middleware error:", error);
    res.status(401).json({ error: "Authentication required" });
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
