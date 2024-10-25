import { supabaseClient } from "../lib/supabaseClient.js";
import logger from "../utils/logger.js";

export const requireAdmin = async (req, res, next) => {
  try {
    // Get the user from the request (set by auth middleware)
    const userId = req.user?.id;

    if (!userId) {
      logger.error("No user ID found in admin middleware");
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if user exists and is admin
    const { data: user, error } = await supabaseClient
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    if (error || !user) {
      logger.error("Error fetching user in admin middleware:", error);
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (user.role !== "admin") {
      logger.error("Non-admin user attempted to access admin route");
      return res
        .status(403)
        .json({ error: "Forbidden - Admin access required" });
    }

    next();
  } catch (error) {
    logger.error("Error in admin middleware:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
