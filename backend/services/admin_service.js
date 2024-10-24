import { supabaseClient } from "../lib/supabaseClient.js";
import logger from "../utils/logger.js";

export async function getAdminStats() {
  try {
    // Get total users count
    const { count: usersCount } = await supabaseClient
      .from("users")
      .select("*", { count: "exact", head: true });

    // Get active subscriptions count
    const { count: activeSubscriptions } = await supabaseClient
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    // Get total assessments count
    const { count: assessmentsCount } = await supabaseClient
      .from("multi_rater_assessments")
      .select("*", { count: "exact", head: true });

    // Get consultant count
    const { count: consultantsCount } = await supabaseClient
      .from("consultant_profiles")
      .select("*", { count: "exact", head: true });

    return {
      usersCount,
      activeSubscriptions,
      assessmentsCount,
      consultantsCount,
    };
  } catch (error) {
    logger.error("Error fetching admin stats:", error);
    throw error;
  }
}

export async function getRecentActivity() {
  try {
    const { data: recentUsers } = await supabaseClient
      .from("users")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    const { data: recentAssessments } = await supabaseClient
      .from("multi_rater_assessments")
      .select("*, users(name, email)")
      .order("created_at", { ascending: false })
      .limit(5);

    return {
      recentUsers,
      recentAssessments,
    };
  } catch (error) {
    logger.error("Error fetching recent activity:", error);
    throw error;
  }
}
