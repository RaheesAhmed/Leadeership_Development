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
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.post("/logout", requireAuth, handleLogout);
router.get("/profile", requireAuth, handleGetProfile);
router.put("/profile", requireAuth, handleUpdateProfile);
router.post("/request-password-reset", handleRequestPasswordReset);
router.post("/confirm-password-reset", handleConfirmPasswordReset);

export default router;
