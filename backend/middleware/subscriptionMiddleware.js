import { checkSubscriptionStatus } from "../services/subscriptionService.js";
import logger from "../utils/logger.js";

export const requireActiveSubscription = async (req, res, next) => {
  try {
    const subscription = await checkSubscriptionStatus(req.user.id);

    if (!subscription) {
      return res.status(403).json({
        error: "Active subscription required for this feature",
      });
    }

    next();
  } catch (error) {
    logger.error("Subscription check failed:", error);
    res.status(500).json({ error: "Failed to verify subscription status" });
  }
};
