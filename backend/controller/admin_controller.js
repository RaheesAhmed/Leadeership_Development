import { getAdminStats, getRecentActivity } from "../services/admin_service.js";
import logger from "../utils/logger.js";

export const handleGetAdminStats = async (req, res) => {
  try {
    const stats = await getAdminStats();
    res.json(stats);
  } catch (error) {
    logger.error("Error in handleGetAdminStats:", error);
    res.status(500).json({ error: "Failed to fetch admin statistics" });
  }
};

export const handleGetRecentActivity = async (req, res) => {
  try {
    const activity = await getRecentActivity();
    res.json(activity);
  } catch (error) {
    logger.error("Error in handleGetRecentActivity:", error);
    res.status(500).json({ error: "Failed to fetch recent activity" });
  }
};

export const handleTrainingUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Process the training file
    const response = await processFileAndSaveToSupabase(req.file.path);

    logger.info("Training file processed successfully");
    res.json({ message: "Training file processed successfully", response });
  } catch (error) {
    logger.error("Error processing training file:", error);
    res.status(500).json({ error: "Failed to process training file" });
  }
};
