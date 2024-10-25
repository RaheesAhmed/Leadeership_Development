import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  handleGetSubscriptionStatus,
  handleCreateSubscription,
  handleCancelSubscription,
} from "../controller/subscription_controller.js";

const router = express.Router();

router.get("/status", requireAuth, handleGetSubscriptionStatus);
router.post("/create", requireAuth, handleCreateSubscription);
router.post("/cancel", requireAuth, handleCancelSubscription);

export default router;
