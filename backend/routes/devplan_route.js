import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  getDevelopmentPlan,
  createDevelopmentPlan,
  updateDevelopmentPlan,
  handleDevPlan,
} from "../controller/devplan_controller.js";

const router = express.Router();

router.post("/generate", requireAuth, handleDevPlan);
router.get("/", requireAuth, getDevelopmentPlan);
router.post("/", requireAuth, createDevelopmentPlan);
router.put("/", requireAuth, updateDevelopmentPlan);

export default router;
