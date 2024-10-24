import {
  registerUser,
  loginUser,
  updateUserProfile,
  logoutUser,
} from "../services/auth_service.js";
import { supabaseClient } from "../lib/supabaseClient.js";

export const handleRegister = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;
    const result = await registerUser(name, email, password, role, department);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);

    // Set the token as an HTTP-only cookie
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const handleUpdateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, department } = req.body;

    // Validate input
    if (!name || !department) {
      return res
        .status(400)
        .json({ error: "Name and department are required" });
    }

    // Update user profile in database
    const { data: updatedUser, error } = await supabaseClient
      .from("users")
      .update({
        name,
        department,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error updating user profile:", error);
      return res.status(500).json({ error: "Failed to update profile" });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        department: updatedUser.department,
      },
    });
  } catch (error) {
    console.error("Error in handleUpdateProfile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleLogout = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await logoutUser(userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const handleConfirmPasswordReset = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const result = await confirmPasswordReset(token, newPassword);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const handleRequestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await requestPasswordReset(email);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const handleGetProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user data from the database
    const { data: userData, error } = await supabaseClient
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return res.status(500).json({ error: "Error fetching user profile" });
    }

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        department: userData.department,
      },
    });
  } catch (error) {
    console.error("Error in handleGetProfile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
