import { createRouter } from "../lib/routerLib.js";
import {
  handleCreateAssessment,
  handleAddRating,
  handleGenerateMultiRaterPlan,
} from "../controller/multi_rater_controller.js";

const router = createRouter();

router.post("/create", handleCreateAssessment);
router.post("/rate", handleAddRating);
router.get("/generate-plan/:assessmentId", handleGenerateMultiRaterPlan);

export default router;
