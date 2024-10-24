import { supabaseClient } from "../lib/supabaseClient.js";
import logger from "../utils/logger.js";

export const createConsultantProfile = async (consultantData) => {
  try {
    const { data, error } = await supabaseClient
      .from("consultant_profiles")
      .insert([consultantData])
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error("Error creating consultant profile:", error);
    throw error;
  }
};

export const generateApiKey = async (consultantId) => {
  // Implementation for generating and storing API keys for consultants
};

export const validateApiKey = async (apiKey) => {
  // Implementation for validating consultant API keys
};
