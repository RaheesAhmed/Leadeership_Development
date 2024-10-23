import { createRouter } from "../lib/routerLib.js";
import { handleGetDashboardData } from "../controller/dashboard_controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = createRouter();

router.get("/", protect, handleGetDashboardData);

export default router;
