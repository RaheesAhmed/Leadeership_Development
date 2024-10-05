import { createRouter } from "../lib/routerLib.js";
import { handleDemographic } from "../controller/demographic_controller.js";

const router = createRouter();

router.get("/", handleDemographic);

export default router;
