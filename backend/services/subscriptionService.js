import { supabaseClient } from "../lib/supabaseClient.js";
import logger from "../utils/logger.js";

export const createSubscription = async (userId, planDetails) => {
  try {
    const { data, error } = await supabaseClient
      .from("subscriptions")
      .insert([
        {
          user_id: userId,
          plan_type: planDetails.planType,
          start_date: new Date(),
          end_date: planDetails.endDate,
          status: "active",
        },
      ])
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error("Error creating subscription:", error);
    throw error;
  }
};

export const checkSubscriptionStatus = async (userId) => {
  try {
    const { data, error } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error("Error checking subscription:", error);
    throw error;
  }
};
