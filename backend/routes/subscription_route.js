import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createSubscription,
  checkSubscriptionStatus,
} from "../services/subscriptionService.js";
import logger from "../utils/logger.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const subscription = await createSubscription(req.user.id, req.body);
    res.status(201).json(subscription);
  } catch (error) {
    logger.error("Subscription creation failed:", error);
    res.status(500).json({ error: "Failed to create subscription" });
  }
});

router.get("/status", protect, async (req, res) => {
  try {
    const status = await checkSubscriptionStatus(req.user.id);
    res.json(status);
  } catch (error) {
    logger.error("Subscription status check failed:", error);
    res.status(500).json({ error: "Failed to check subscription status" });
  }
});

export default router;
