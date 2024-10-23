import { createRouter } from "../lib/routerLib.js";
import { handleGenerateDevelopmentPlan } from "../controller/assistant_controller.js";

const router = createRouter();

// Add this new route
router.post("/generate-development-plan", handleGenerateDevelopmentPlan);

export default router;
