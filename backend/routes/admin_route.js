import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import {
  handleGetAdminStats,
  handleGetRecentActivity,
  handleTrainingUpload,
  handleGetSubscriptionStats,
  handleGetAssessmentStats,
} from "../controller/admin_controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Apply auth middleware to all routes
router.use(requireAuth);
router.use(requireAdmin);

// Admin dashboard statistics
router.get("/stats", handleGetAdminStats);

// Recent activity
router.get("/activity", handleGetRecentActivity);

// Subscription statistics
router.get("/subscription-stats", handleGetSubscriptionStats);

// Assessment statistics
router.get("/assessment-stats", handleGetAssessmentStats);

// Upload training file
router.post("/upload-training", upload.single("file"), handleTrainingUpload);

export default router;
