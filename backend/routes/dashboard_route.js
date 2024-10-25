import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { handleGetDashboardData } from "../controller/dashboard_controller.js";

const router = express.Router();

router.get("/", requireAuth, handleGetDashboardData);

export default router;
