import { supabaseClient } from "../lib/supabaseClient.js";
import logger from "../utils/logger.js";

export const handleGetSubscriptionStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: subscription, error } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    if (error) {
      logger.error("Error fetching subscription:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch subscription status" });
    }

    return res.json({
      subscriptionStatus: subscription
        ? {
            plan_type: subscription.plan_type,
            status: subscription.status,
            end_date: subscription.end_date,
          }
        : { plan_type: "free", status: "active" },
    });
  } catch (error) {
    logger.error("Error in handleGetSubscriptionStatus:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const handleCreateSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const { plan_type } = req.body;

    if (!plan_type) {
      return res.status(400).json({ error: "Plan type is required" });
    }

    // Calculate end date (30 days from now)
    const end_date = new Date();
    end_date.setDate(end_date.getDate() + 30);

    // First, cancel any existing active subscriptions
    await supabaseClient
      .from("subscriptions")
      .update({ status: "cancelled" })
      .eq("user_id", userId)
      .eq("status", "active");

    // Create new subscription
    const { data: subscription, error } = await supabaseClient
      .from("subscriptions")
      .insert({
        user_id: userId,
        plan_type,
        end_date,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      logger.error("Error creating subscription:", error);
      return res.status(500).json({ error: "Failed to create subscription" });
    }

    return res.status(201).json(subscription);
  } catch (error) {
    logger.error("Error in handleCreateSubscription:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const handleCancelSubscription = async (req, res) => {
  try {
    const userId = req.user.id;

    const { error } = await supabaseClient
      .from("subscriptions")
      .update({ status: "cancelled" })
      .eq("user_id", userId)
      .eq("status", "active");

    if (error) {
      logger.error("Error cancelling subscription:", error);
      return res.status(500).json({ error: "Failed to cancel subscription" });
    }

    return res.json({ message: "Subscription cancelled successfully" });
  } catch (error) {
    logger.error("Error in handleCancelSubscription:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
