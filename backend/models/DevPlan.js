import { supabaseClient } from "../lib/supabaseClient.js";
import logger from "../utils/logger.js";

class DevPlan {
  static async findOne({ userId }) {
    try {
      const { data, error } = await supabaseClient
        .from("development_plans")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error("Error finding development plan:", error);
      return null;
    }
  }

  static async findOneAndUpdate({ userId }, { $set }, { new: boolean }) {
    try {
      const { data, error } = await supabaseClient
        .from("development_plans")
        .update($set)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error("Error updating development plan:", error);
      return null;
    }
  }

  constructor(planData) {
    this.userId = planData.userId;
    this.formattedPlan = planData.formattedPlan;
    this.rawPlan = planData.rawPlan;
  }

  async save() {
    try {
      const { data, error } = await supabaseClient
        .from("development_plans")
        .insert([
          {
            user_id: this.userId,
            formatted_plan: this.formattedPlan,
            raw_plan: this.rawPlan,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error("Error saving development plan:", error);
      throw error;
    }
  }
}

export default DevPlan;
