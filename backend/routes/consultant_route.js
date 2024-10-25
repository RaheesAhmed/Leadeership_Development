import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  handleGetConsultantProfile,
  handleUpdateConsultantProfile,
  handleGenerateApiKey,
  handleGetApiUsage,
} from "../controller/consultant_controller.js";

const router = express.Router();

// Get consultant profile
router.get("/profile", requireAuth, handleGetConsultantProfile);

// Update consultant profile
router.put("/profile", requireAuth, handleUpdateConsultantProfile);

// Generate new API key
router.post("/api-key", requireAuth, handleGenerateApiKey);

// Get API usage statistics
router.get("/api-usage", requireAuth, handleGetApiUsage);

export default router;
