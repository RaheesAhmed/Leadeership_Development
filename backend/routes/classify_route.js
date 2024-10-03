import { handleClassify } from '../controller/classify_controller.js';
import { createRouter, wrapAsync } from '../lib/routerLib.js';

const router = createRouter();

router.post("/", handleClassify);

export default router;
