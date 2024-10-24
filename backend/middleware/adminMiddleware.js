import { supabaseClient } from "../lib/supabaseClient.js";
import logger from "../utils/logger.js";

export const requireAdmin = async (req, res, next) => {
  try {
    const { data: user } = await supabaseClient
      .from("users")
      .select("role")
      .eq("id", req.user.id)
      .single();

    if (user?.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    next();
  } catch (error) {
    logger.error("Error in admin middleware:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
