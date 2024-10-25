import {
  registerUser,
  loginUser,
  updateUserProfile,
  logoutUser,
} from "../services/auth_service.js";
import { supabaseClient } from "../lib/supabaseClient.js";
import logger from "../utils/logger.js";

export const handleRegister = async (req, res) => {
  try {
    const { name, email, password, role = "user", department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email and password are required",
      });
    }

    const result = await registerUser(name, email, password, role, department);

    // Set the token as an HTTP-only cookie
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.status(201).json(result);
  } catch (error) {
    logger.error("Registration error:", error);
    res.status(400).json({ error: error.message });
  }
};

export const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await loginUser(email, password);

    // Send both token and user data in response
    res.json({
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    logger.error("Login error:", error);
    res.status(401).json({ error: error.message || "Invalid credentials" });
  }
};

export const handleUpdateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, department } = req.body;

    if (!name || !department) {
      return res.status(400).json({
        error: "Name and department are required",
      });
    }

    const updatedUser = await updateUserProfile(userId, { name, department });

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    logger.error("Profile update error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const handleLogout = async (req, res) => {
  try {
    const userId = req.user.id;
    await logoutUser(userId);

    // Clear the auth cookie
    res.clearCookie("token");

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    logger.error("Logout error:", error);
    res.status(500).json({ error: error.message });
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

    const { data: userData, error } = await supabaseClient
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      logger.error("Error fetching user profile:", error);
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
    logger.error("Error in handleGetProfile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
