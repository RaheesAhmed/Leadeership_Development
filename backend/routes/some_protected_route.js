import express from "express";
import { authMiddleware, roleMiddleware } from "../middleware/auth.js";
import {
  handleUpdateProfile,
  handleLogout,
} from "../controller/auth_controller.js";

const router = express.Router();

router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "This is your profile", user: req.user });
});

router.put("/profile", authMiddleware, handleUpdateProfile);

router.post("/logout", authMiddleware, handleLogout);

router.get(
  "/admin-only",
  authMiddleware,
  roleMiddleware(["admin"]),
  (req, res) => {
    res.json({ message: "This is an admin-only route" });
  }
);

export default router;
