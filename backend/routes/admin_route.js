import express from "express";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import multer from "multer";
import {
  handleGetAdminStats,
  handleGetRecentActivity,
  handleTrainingUpload,
} from "../controller/admin_controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Require both authentication and admin role for all routes
router.use(requireAdmin);

// Get admin dashboard statistics
router.get("/stats", handleGetAdminStats);

// Get recent activity
router.get("/activity", handleGetRecentActivity);

// Upload training file
router.post("/upload-training", upload.single("file"), handleTrainingUpload);

export default router;
