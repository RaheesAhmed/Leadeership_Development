import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabaseClient } from "../lib/supabaseClient.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const registerUser = async (name, email, password, role, department) => {
  try {
    // Check if user already exists
    const { data: existingUser, error: existingUserError } =
      await supabaseClient
        .from("users")
        .select("*")
        .eq("email", email)
        .maybeSingle();

    if (existingUserError && existingUserError.code !== "PGRST116") {
      console.error("Error checking existing user:", existingUserError);
      throw new Error("Error checking existing user");
    }

    if (existingUser) {
      throw new Error("User already exists");
    }

    // Register user using Supabase Auth
    const { data: authData, error: authError } =
      await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            department,
          },
        },
      });

    if (authError) {
      console.error("Error registering user with Supabase Auth:", authError);
      if (authError.message.includes("not authorized")) {
        throw new Error(
          "Email address is not authorized. Please check your Supabase authentication settings."
        );
      }
      throw new Error(`Error creating user: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error("User was not created");
    }

    // Insert or update user data in the users table
    const { data: userData, error: upsertError } = await supabaseClient
      .from("users")
      .upsert(
        {
          id: authData.user.id,
          name,
          email,
          role,
          department,
        },
        { onConflict: "id" }
      )
      .select()
      .single();

    if (upsertError) {
      console.error("Error upserting user data:", upsertError);
      throw new Error(
        `Error creating/updating user record: ${upsertError.message}`
      );
    }

    // Generate JWT
    const token = jwt.sign({ id: authData.user.id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return {
      user: userData,
      token,
    };
  } catch (error) {
    console.error("Error in registerUser:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    // Authenticate user using Supabase Auth
    const { data: authData, error: authError } =
      await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      console.error("Error logging in user:", authError);
      throw new Error("Invalid credentials");
    }

    if (!authData.user) {
      throw new Error("User not found");
    }

    // Fetch additional user data from the users table
    let { data: userData, error: userError } = await supabaseClient
      .from("users")
      .select("name, role, department")
      .eq("id", authData.user.id)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
      // If user data doesn't exist in the users table, use data from auth
      userData = {
        name: authData.user.user_metadata.name || email.split("@")[0],
        role: authData.user.user_metadata.role || "user",
        department: authData.user.user_metadata.department || "Unknown",
      };
    }

    // Generate JWT
    const token = jwt.sign({ id: authData.user.id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return {
      user: {
        id: authData.user.id,
        name: userData.name,
        email: email,
        role: userData.role,
        department: userData.department,
      },
      token,
    };
  } catch (error) {
    console.error("Error in loginUser:", error);
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
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw new Error(`Error logging out: ${error.message}`);
    return { message: "Logged out successfully" };
  } catch (error) {
    console.error("Error in logoutUser:", error);
    throw error;
  }
};
