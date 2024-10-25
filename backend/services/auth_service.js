import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabaseClient } from "../lib/supabaseClient.js";
import logger from "../utils/logger.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const registerUser = async (name, email, password, role, department) => {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Register with Supabase Auth first
    const { data: authData, error: authError } =
      await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { name, role, department },
        },
      });

    if (authError) {
      logger.error("Supabase auth error:", authError);
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error("Failed to create user");
    }

    // Create user in our database
    const { data: user, error: dbError } = await supabaseClient
      .from("users")
      .insert({
        id: authData.user.id,
        email,
        name,
        role,
        department,
        password: hashedPassword,
      })
      .select()
      .single();

    if (dbError) {
      logger.error("Database error:", dbError);
      throw new Error("Failed to create user record");
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return { user, token };
  } catch (error) {
    logger.error("Registration error:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    // Get user from database
    const { data: user, error } = await supabaseClient
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      throw new Error("User not found");
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
      token,
    };
  } catch (error) {
    logger.error("Login error:", error);
    throw error;
  }
};

export const updateUserProfile = async (userId, updateData) => {
  try {
    const { data, error } = await supabaseClient
      .from("users")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw new Error(`Error updating user profile: ${error.message}`);

    return data;
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    throw error;
  }
};

export const logoutUser = async (userId) => {
  try {
    // You might want to invalidate the token on the server side
    // or perform any cleanup needed
    return { message: "Logged out successfully" };
  } catch (error) {
    logger.error("Logout error:", error);
    throw error;
  }
};
