import express from "express";
import {
  handleRegister,
  handleLogin,
  handleUpdateProfile,
  handleLogout,
  handleRequestPasswordReset,
  handleConfirmPasswordReset,
} from "../controller/auth_controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.put("/profile", protect, handleUpdateProfile);
router.post("/logout", protect, handleLogout);
router.post("/request-password-reset", handleRequestPasswordReset);
router.post("/confirm-password-reset", handleConfirmPasswordReset);

export default router;
