import { validateApiKey } from "../services/whiteLabelService.js";
import logger from "../utils/logger.js";

export const requireValidApiKey = async (req, res, next) => {
  const apiKey = req.header("X-API-Key");

  if (!apiKey) {
    return res.status(401).json({ error: "API key is required" });
  }

  try {
    const isValid = await validateApiKey(apiKey);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid API key" });
    }
    next();
  } catch (error) {
    logger.error("API key validation failed:", error);
    res.status(500).json({ error: "Failed to validate API key" });
  }
};
