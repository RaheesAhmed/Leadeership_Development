import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  handleGenerateDevelopmentPlan,
  handleGetDevelopmentPlan,
} from "../controller/assistant_controller.js";

const router = express.Router();

router.use(requireAuth);

router.post("/generate-development-plan", handleGenerateDevelopmentPlan);
router.get("/development-plan", handleGetDevelopmentPlan);

export default router;
