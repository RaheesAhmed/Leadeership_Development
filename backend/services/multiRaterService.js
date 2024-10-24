import { supabaseClient } from "../lib/supabaseClient.js";
import logger from "../utils/logger.js";

export const createMultiRaterAssessment = async (userId, assessmentData) => {
  try {
    const { data, error } = await supabaseClient
      .from("multi_rater_assessments")
      .insert([
        {
          user_id: userId,
          status: "pending",
          ...assessmentData,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error("Error creating multi-rater assessment:", error);
    throw error;
  }
};

export const addRating = async (assessmentId, ratingData) => {
  try {
    const { data, error } = await supabaseClient
      .from("multi_rater_ratings")
      .insert([
        {
          assessment_id: assessmentId,
          ...ratingData,
        },
      ])
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error("Error adding rating:", error);
    throw error;
  }
};
