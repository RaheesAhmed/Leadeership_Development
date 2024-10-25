import { OpenAI } from "openai";
import dotenv from "dotenv";
import generateDevelopmentPlan from "../services/development_plan.js";
import { supabaseClient } from "../lib/supabaseClient.js";
import logger from "../utils/logger.js";

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
const assistantId = process.env.OPENAI_ASSISTANT_ID;

const openai = new OpenAI({ apiKey });

export const handleGenerateDevelopmentPlan = async (req, res) => {
  try {
    const { userInfo, responsibilityLevel, answers, assessmentCompleted } =
      req.body;

    logger.info("Generating development plan for user:");

    let assessmentData = {
      userData: userInfo,
      responsibilityLevel: responsibilityLevel,
      assessmentCompleted: assessmentCompleted,
      ratings: assessmentCompleted ? answers : [],
    };

    const developmentPlan = await generateDevelopmentPlan(assessmentData);

    // Save to Supabase with the authenticated user's ID
    const { data: savedPlan, error: saveError } = await supabaseClient
      .from("development_plans")
      .insert({
        user_id: userId,
        formatted_plan: developmentPlan.formattedPlan,
        raw_plan: developmentPlan.rawPlan,
      })
      .select()
      .single();

    if (saveError) {
      logger.error("Error saving development plan:", saveError);
      throw new Error("Failed to save development plan");
    }

    logger.info("Development plan saved successfully:", {
      planId: savedPlan.id,
    });

    res.status(200).json({
      message: "Development plan generated and saved successfully",
      plan: developmentPlan,
      savedPlan,
    });
  } catch (error) {
    logger.error("Error in handleGenerateDevelopmentPlan:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to generate development plan" });
  }
};

// Add a function to get the saved development plan
export const handleGetDevelopmentPlan = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error("User ID is required");
    }

    const { data: plan, error } = await supabaseClient
      .from("development_plans")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      logger.error("Error fetching development plan:", error);
      throw new Error("Failed to fetch development plan");
    }

    if (!plan) {
      return res.status(404).json({ message: "No development plan found" });
    }

    res.json({ plan });
  } catch (error) {
    logger.error("Error in handleGetDevelopmentPlan:", error);
    res.status(500).json({
      error: error.message || "Failed to fetch development plan",
    });
  }
};
