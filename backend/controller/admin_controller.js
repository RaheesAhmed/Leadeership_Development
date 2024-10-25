import { supabaseClient } from "../lib/supabaseClient.js";
import logger from "../utils/logger.js";

export const handleGetAdminStats = async (req, res) => {
  try {
    // Get total users count with proper error handling
    const { data: users, error: usersError } = await supabaseClient
      .from("users")
      .select("*");

    if (usersError) throw usersError;
    const usersCount = users?.length || 0;

    // Get active subscriptions with proper error handling
    const { data: subscriptions, error: subsError } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("status", "active");

    if (subsError) throw subsError;
    const activeSubscriptions = subscriptions?.length || 0;

    // Get total assessments with proper error handling
    const { data: assessments, error: assessError } = await supabaseClient
      .from("assessments")
      .select("*");

    if (assessError) throw assessError;
    const assessmentsCount = assessments?.length || 0;

    // Get total consultants with proper error handling
    const { data: consultants, error: consultError } = await supabaseClient
      .from("consultant_profiles")
      .select("*");

    if (consultError) throw consultError;
    const consultantsCount = consultants?.length || 0;

    logger.info("Admin stats fetched successfully:", {
      usersCount,
      activeSubscriptions,
      assessmentsCount,
      consultantsCount,
    });

    res.json({
      usersCount,
      activeSubscriptions,
      assessmentsCount,
      consultantsCount,
    });
  } catch (error) {
    logger.error("Error in handleGetAdminStats:", error);
    res.status(500).json({ error: "Failed to fetch admin statistics" });
  }
};

export const handleGetRecentActivity = async (req, res) => {
  try {
    // Get recent users with proper error handling
    const { data: recentUsers, error: usersError } = await supabaseClient
      .from("users")
      .select("id, name, email, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    if (usersError) throw usersError;

    // Get recent assessments with user info
    const { data: recentAssessments, error: assessError } = await supabaseClient
      .from("assessments")
      .select(
        `
        id,
        created_at,
        user_id,
        users (
          name,
          email
        )
      `
      )
      .order("created_at", { ascending: false })
      .limit(5);

    if (assessError) throw assessError;

    logger.info("Recent activity fetched successfully");

    res.json({
      recentUsers: recentUsers || [],
      recentAssessments: recentAssessments || [],
    });
  } catch (error) {
    logger.error("Error in handleGetRecentActivity:", error);
    res.status(500).json({ error: "Failed to fetch recent activity" });
  }
};

export const handleTrainingUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Process the training file
    const response = await processFileAndSaveToSupabase(req.file.path);

    logger.info("Training file processed successfully");
    res.json({ message: "Training file processed successfully", response });
  } catch (error) {
    logger.error("Error processing training file:", error);
    res.status(500).json({ error: "Failed to process training file" });
  }
};

export const handleGetSubscriptionStats = async (req, res) => {
  try {
    const { data: subscriptions, error } = await supabaseClient
      .from("subscriptions")
      .select("plan_type, status")
      .eq("status", "active");

    if (error) throw error;

    const planStats = (subscriptions || []).reduce((acc, sub) => {
      acc[sub.plan_type] = (acc[sub.plan_type] || 0) + 1;
      return acc;
    }, {});

    logger.info("Subscription stats fetched successfully:", planStats);
    res.json(planStats);
  } catch (error) {
    logger.error("Error in handleGetSubscriptionStats:", error);
    res.status(500).json({ error: "Failed to fetch subscription statistics" });
  }
};

export const handleGetAssessmentStats = async (req, res) => {
  try {
    const { data: assessments, error } = await supabaseClient
      .from("assessments")
      .select("created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const monthlyStats = (assessments || []).reduce((acc, assessment) => {
      const month = new Date(assessment.created_at).toLocaleString("default", {
        month: "long",
      });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    logger.info("Assessment stats fetched successfully:", monthlyStats);
    res.json(monthlyStats);
  } catch (error) {
    logger.error("Error in handleGetAssessmentStats:", error);
    res.status(500).json({ error: "Failed to fetch assessment statistics" });
  }
};
