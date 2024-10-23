import {
  registerUser,
  loginUser,
  updateUserProfile,
  logoutUser,
} from "../services/auth_service.js";

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
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const handleUpdateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the user ID is in the JWT payload
    const { name, role, department } = req.body;

    const updatedUser = await updateUserProfile(userId, {
      name,
      role,
      department,
    });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
