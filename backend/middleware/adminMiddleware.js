import { supabaseClient } from "../lib/supabaseClient.js";
import logger from "../utils/logger.js";

export const requireAdmin = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.error("No authorization token provided");
      return res.status(401).json({ error: "No authorization token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify the token with Supabase
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      logger.error("Invalid or expired token");
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Check if user exists and is admin
    const { data: userData, error: userError } = await supabaseClient
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userError || !userData) {
      logger.error("Error fetching user data:", userError);
      return res.status(401).json({ error: "User not found" });
    }

    if (userData.role !== "admin") {
      logger.error("Non-admin user attempted to access admin route");
      return res
        .status(403)
        .json({ error: "Forbidden - Admin access required" });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    logger.error("Error in admin middleware:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
