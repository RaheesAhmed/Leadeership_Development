import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  handleCreateAssessment,
  handleAddRating,
  handleGenerateMultiRaterPlan,
} from "../controller/multi_rater_controller.js";

const router = express.Router();

router.post("/assessment", requireAuth, handleCreateAssessment);
router.post("/rating", requireAuth, handleAddRating);
router.get("/plan/:assessmentId", requireAuth, handleGenerateMultiRaterPlan);

export default router;
