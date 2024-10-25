import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import {
  handleGetAdminStats,
  handleGetRecentActivity,
  handleTrainingUpload,
} from "../controller/admin_controller.js";
import { handleDataImport } from "../controller/data_import_controller.js";

const router = express.Router();

// Apply both auth and admin middleware to all routes
router.use(requireAuth, requireAdmin);

// Admin dashboard statistics
router.get("/stats", handleGetAdminStats);

// Recent activity
router.get("/activity", handleGetRecentActivity);

// Upload training file
router.post("/training", handleTrainingUpload);

// Import assessment data
router.post("/import-data", handleDataImport);

export default router;
