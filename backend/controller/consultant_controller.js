import { supabaseClient } from "../lib/supabaseClient.js";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger.js";

export const handleGetConsultantProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: profile, error } = await supabaseClient
      .from("consultant_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      logger.error("Error fetching consultant profile:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch consultant profile" });
    }

    return res.json({ profile });
  } catch (error) {
    logger.error("Error in handleGetConsultantProfile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const handleUpdateConsultantProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { company_name, website, white_label_enabled } = req.body;

    const { data: profile, error } = await supabaseClient
      .from("consultant_profiles")
      .update({
        company_name,
        website,
        white_label_enabled,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      logger.error("Error updating consultant profile:", error);
      return res
        .status(500)
        .json({ error: "Failed to update consultant profile" });
    }

    return res.json({ profile });
  } catch (error) {
    logger.error("Error in handleUpdateConsultantProfile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const handleGenerateApiKey = async (req, res) => {
  try {
    const userId = req.user.id;
    const apiKey = uuidv4();

    const { data: profile, error } = await supabaseClient
      .from("consultant_profiles")
      .update({
        api_key: apiKey,
        api_key_created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      logger.error("Error generating API key:", error);
      return res.status(500).json({ error: "Failed to generate API key" });
    }

    return res.json({ apiKey: profile.api_key });
  } catch (error) {
    logger.error("Error in handleGenerateApiKey:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const handleGetApiUsage = async (req, res) => {
  try {
    const userId = req.user.id;

    // First get the consultant profile to get the consultant_id
    const { data: profile, error: profileError } = await supabaseClient
      .from("consultant_profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (profileError) {
      logger.error("Error fetching consultant profile:", profileError);
      return res
        .status(500)
        .json({ error: "Failed to fetch consultant profile" });
    }

    // Then get the API usage data
    const { data: usage, error: usageError } = await supabaseClient
      .from("api_usage")
      .select("*")
      .eq("consultant_id", profile.id)
      .order("timestamp", { ascending: false })
      .limit(100);

    if (usageError) {
      logger.error("Error fetching API usage:", usageError);
      return res.status(500).json({ error: "Failed to fetch API usage" });
    }

    return res.json({ usage });
  } catch (error) {
    logger.error("Error in handleGetApiUsage:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
