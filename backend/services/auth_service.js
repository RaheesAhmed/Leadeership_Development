import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabaseClient } from "../lib/supabaseClient.js";
import logger from "../utils/logger.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const registerUser = async (name, email, password, role, department) => {
  try {
    // Register with Supabase Auth
    const { data: authData, error: authError } =
      await supabaseClient.auth.signUp({
        email,
        password,
      });

    if (authError) throw authError;

    if (!authData.user) {
      throw new Error("Registration failed");
    }

    // Insert into users table
    const { data: userData, error: userError } = await supabaseClient
      .from("users")
      .insert([
        {
          id: authData.user.id,
          email,
          name,
          role: role || "user",
          department,
        },
      ])
      .select()
      .limit(1);

    if (userError) throw userError;

    if (!userData || userData.length === 0) {
      throw new Error("Failed to create user profile");
    }

    return {
      token: authData.session?.access_token,
      user: userData[0],
    };
  } catch (error) {
    logger.error("Registration error:", error);
    throw new Error(error.message || "Registration failed");
  }
};

export const loginUser = async (email, password) => {
  try {
    // First authenticate with Supabase
    const { data: authData, error: authError } =
      await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) throw authError;

    if (!authData || !authData.session) {
      throw new Error("Authentication failed");
    }

    // Get user data from the users table
    const { data: users, error: userError } = await supabaseClient
      .from("users")
      .select("*")
      .eq("email", email)
      .limit(1);

    if (userError) throw userError;

    if (!users || users.length === 0) {
      throw new Error("User not found");
    }

    const userData = users[0];

    return {
      token: authData.session.access_token,
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        department: userData.department,
      },
    };
  } catch (error) {
    logger.error("Login error:", error);
    throw new Error(error.message || "Login failed");
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabaseClient
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      throw new Error("User not found");
    }

    return data[0];
  } catch (error) {
    logger.error("Profile update error:", error);
    throw new Error(error.message || "Profile update failed");
  }
};

export const logoutUser = async (userId) => {
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error) {
    logger.error("Logout error:", error);
    throw new Error(error.message || "Logout failed");
  }
};
