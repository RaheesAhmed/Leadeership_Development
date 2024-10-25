import { supabaseClient } from "../lib/supabaseClient.js";

export class User {
  static async findById(userId) {
    try {
      const { data: user, error } = await supabaseClient
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return user;
    } catch (error) {
      console.error("Error finding user:", error);
      return null;
    }
  }

  static async findByEmail(email) {
    try {
      const { data: user, error } = await supabaseClient
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (error) throw error;
      return user;
    } catch (error) {
      console.error("Error finding user:", error);
      return null;
    }
  }
}
