import express from "express";
import {
  handleRegister,
  handleLogin,
  handleUpdateProfile,
  handleLogout,
  handleRequestPasswordReset,
  handleConfirmPasswordReset,
  handleGetProfile,
} from "../controller/auth_controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.get("/profile", authMiddleware, handleGetProfile);
router.put("/profile", authMiddleware, handleUpdateProfile);
router.post("/logout", authMiddleware, handleLogout);
router.post("/request-password-reset", handleRequestPasswordReset);
router.post("/confirm-password-reset", handleConfirmPasswordReset);

export default router;
