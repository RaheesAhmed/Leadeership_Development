import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createConsultantProfile,
  generateApiKey,
  validateApiKey,
} from "../services/whiteLabelService.js";
import logger from "../utils/logger.js";

const router = express.Router();

router.post("/profile", protect, async (req, res) => {
  try {
    const profile = await createConsultantProfile(req.body);
    res.status(201).json(profile);
  } catch (error) {
    logger.error("Consultant profile creation failed:", error);
    res.status(500).json({ error: "Failed to create consultant profile" });
  }
});

router.post("/api-key", protect, async (req, res) => {
  try {
    const apiKey = await generateApiKey(req.user.id);
    res.json({ apiKey });
  } catch (error) {
    logger.error("API key generation failed:", error);
    res.status(500).json({ error: "Failed to generate API key" });
  }
});

export default router;
