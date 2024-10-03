import { handleDevPlan } from '../controller/devplan_controller.js';
import { createRouter, wrapAsync } from '../lib/routerLib.js';

const router = createRouter();

router.post('/', handleDevPlan);

export default router;
